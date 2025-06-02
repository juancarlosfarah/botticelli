import { ReactElement, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@mui/icons-material/CheckRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';

import InputType from '@shared/enums/InputType';
import { KeyPressData } from '@shared/interfaces/Event';

import { AppDispatch, RootState } from '../../store';
import { dismissExchange } from '../exchange/ExchangesSlice';
import {
  deleteAudio,
  deleteOneAudio,
  resetAudioStatus,
  saveNewAudio,
  selectAudios,
  sendAudios,
  transcribeAudio,
} from './AudiosSlice';

interface AudioChunk {
  url: string;
  blob: Blob;
  transcription?: string;
  id: string;
}
export type VoiceInputProps = {
  exchangeId: string;
  interactionId: string;
  participantId: string;
  inputType: InputType;
  completed: boolean;
};

export default function VoiceInput({
  exchangeId,
  interactionId,
  participantId,
  completed,
  inputType,
}: VoiceInputProps): ReactElement {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<AudioChunk[]>([]);
  const [keypressData] = useState<KeyPressData[]>([]);

  const audioChunksRef = useRef<Blob[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const handleDismiss = (): void => {
    dispatch(dismissExchange(exchangeId));
  };
  const status = useSelector((state: RootState) => state.audios.status);
  const audios = useSelector(selectAudios);

  const sendMessage = async (): Promise<void> => {
    console.log('[SEND] dispatching transcribeAudio...');
    try {
      let text = '';
      let allSucceeded = true;

      for (const chunk of audioChunks) {
        const reduxAudio = audios.find((a) => a.id === chunk.id);
        if (!reduxAudio?.blobPath) {
          console.warn('Missing blobPath for chunk', chunk.id);
          allSucceeded = false;
          continue;
        }

        try {
          let transcription = await dispatch(
            transcribeAudio({
              blobPath: reduxAudio.blobPath,
              exchangeId,
              participantId,
              audioId: reduxAudio.id,
            }),
          ).unwrap();

          console.log(
            `[DEBUG] Transcription for ${chunk.id}: "${transcription}"`,
          );

          if (!transcription.trim()) {
            console.warn('Transcription is empty for chunk', chunk.id);
            transcription = '[empty transcription]';
          }

          text += transcription + ' ';
          setAudioChunks((prevChunks) =>
            prevChunks.map((c) =>
              c.id === chunk.id ? { ...c, transcription } : c,
            ),
          );
        } catch (err) {
          console.error('Transcription failed', err);
          allSucceeded = false;
        } finally {
          dispatch(resetAudioStatus());
        }
      }

      if (!allSucceeded) {
        console.warn(
          '[SEND] Not all audio chunks succeeded — aborting sendAudios',
        );
        dispatch(resetAudioStatus());
        return;
      }

      const result = await dispatch(
        sendAudios({
          interactionId,
          exchangeId,
          inputType,
          keyPressEvents: keypressData,
          content: text.trim(),
          evaluate: true,
          sender: {
            id: participantId,
            type: 'user',
          },
          participantId,
          audios,
          blobs: audioChunks.map((chunk) => chunk.blob),
        }),
      ).unwrap();

      console.log('[SEND] sendAudios succeeded:', result);
      setAudioChunks([]);
      dispatch(resetAudioStatus());
    } catch (err) {
      console.error('[SEND] sendAudios failed:', err);
      // Ensure UI is not stuck
      dispatch(resetAudioStatus());
    }
  };

  const handleStartRecording = async (): Promise<void> => {
    let stream: MediaStream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error('Mic access failed:', err);
      return;
    }

    const audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.createMediaStreamDestination();

    source.connect(destination);

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.start();

    setIsRecording(true);
    setRecordingDuration(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev) => {
        if (prev >= 30) {
          handleStopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });

        console.log('[DEBUG] audioBlob size:', audioBlob.size);
        console.log('[DEBUG] audioBlob type:', audioBlob.type);

        const audioUrl = URL.createObjectURL(audioBlob);
        audioChunksRef.current = [];

        console.log('front end saveNewAudio');
        const newAudio = await dispatch(
          saveNewAudio({
            exchangeId,
            blob: audioBlob,
            interactionId,
          }),
        ).unwrap();

        const newChunk: AudioChunk = {
          url: audioUrl,
          blob: audioBlob,
          id: newAudio.id,
        };
        setAudioChunks((prev) => [...prev, newChunk]);
      };
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const deleteAudioChunk = (index: number) => {
    URL.revokeObjectURL(audioChunks[index].url);
    const audioChunkToDelete = audioChunks[index];

    // Delete the chunk from local state
    setAudioChunks(audioChunks.filter((_, i) => i !== index));

    // Find the corresponding Audio by ID and dispatch the delete action
    const audioToDelete = audios.find(
      (audio) => audio.id === audioChunkToDelete.id,
    );
    if (audioToDelete) {
      dispatch(deleteAudio(audioToDelete.id));
    }
  };

  const deleteStoredAudio = (index: number) => {
    URL.revokeObjectURL(audioChunks[index].url);
    const audioChunkToDelete = audioChunks[index];

    // Delete the chunk from local state
    setAudioChunks(audioChunks.filter((_, i) => i !== index));

    // Find the corresponding Audio by ID and dispatch the delete action
    const audioToDelete = audios.find(
      (audio) => audio.id === audioChunkToDelete.id,
    );
    if (audioToDelete) {
      dispatch(deleteAudio(audioToDelete.id));
      dispatch(deleteOneAudio({ audioId: audioToDelete.id }));
    }
  };

  // text Input pattern :
  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <Box sx={{ border: 2, borderColor: 'divider', borderRadius: 'md', p: 1 }}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-evenly"
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ width: '100%', height: '100%' }}
        >
          {/* Mic recording */}
          <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={1}
            sx={{ width: '25%', height: '100%' }}
          >
            {isRecording && (
              <Typography variant="body1" align="center" gutterBottom>
                Recording: {recordingDuration}s
              </Typography>
            )}
            {!isRecording && (
              <Typography variant="body1" align="center" gutterBottom>
                Click to record
              </Typography>
            )}

            <IconButton
              variant="solid"
              color={isRecording ? 'danger' : 'primary'}
              aria-label="recording"
              onClick={toggleRecording}
            >
              {isRecording ? <StopCircleRoundedIcon /> : <MicRoundedIcon />}
            </IconButton>

            <Typography variant="caption" align="center" gutterBottom>
              (max 30s)
            </Typography>
          </Stack>

          {/* audio chunks display */}
          <Box
            sx={{
              flexGrow: 1,
              overflowX: 'auto',
              maxHeight: '100px',
              overflowY: 'auto',
              width: '50%',
            }}
          >
            <List>
              {audioChunks.length > 0 &&
                status.toSend === 'idle' &&
                audioChunks.map((chunk, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <div>{index + 1}</div>
                    {/* status.status.recording === 'idle' &&  */}
                    {<audio controls src={chunk.url} />}
                    <Button
                      size="sm"
                      variant="outlined"
                      color="danger"
                      onClick={() => deleteStoredAudio(index)}
                    >
                      <DeleteForeverRoundedIcon />
                    </Button>
                  </Box>
                ))}
              {status.toSend == 'loading' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <div>{audioChunks.length + 1}</div>

                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={298}
                    height={40}
                  />
                  <Skeleton variant="rounded" width={35} height={35} />
                </Box>
              )}
            </List>
          </Box>

          {/* send button */}
          <Stack
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={1}
            sx={{ width: '25%', height: '100%' }}
          >
            {!completed && (
              <div>
                <br></br>
              </div>
            )}
            {completed && (
              <Typography variant="body1" align="center" gutterBottom>
                Click `Done` to end this exchange...
              </Typography>
            )}
            {completed && (
              <Button
                size="sm"
                color="success"
                endDecorator={<CheckIcon />}
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                onClick={handleDismiss}
              >
                Done
              </Button>
            )}
            {completed && (
              <Typography variant="caption" align="center" gutterBottom>
                ... or continue the conversation
              </Typography>
            )}
            <IconButton
              variant="solid"
              aria-label="send"
              color="success"
              disabled={audioChunks.length === 0 || status.toSend === 'loading'}
              onClick={sendMessage}
            >
              <SendRoundedIcon />
            </IconButton>

            {audioChunks.length === 1 &&
              status.toSend === 'idle' &&
              !completed && (
                <Typography variant="caption" align="center" gutterBottom>
                  Send 1 message
                </Typography>
              )}
            {audioChunks.length > 1 &&
              status.toSend === 'idle' &&
              !completed && (
                <Typography variant="caption" align="center" gutterBottom>
                  Send {audioChunks.length} messages
                </Typography>
              )}
            {audioChunks.length === 0 &&
              status.toSend !== 'loading' &&
              !completed && (
                <Typography variant="caption" align="center" gutterBottom>
                  Record some messages
                </Typography>
              )}
            {status.toSend === 'loading' && !completed && (
              <Typography variant="caption" align="center" gutterBottom>
                Wait a few seconds
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
