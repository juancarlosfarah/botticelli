import { ReactElement, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Stack } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';

import InputType from '@shared/enums/InputType';

/* import { KeyPressData } from '@shared/interfaces/Event';

import { AppDispatch } from '../../store';
import { dismissExchange } from '../exchange/ExchangesSlice';
import { saveNewMessage } from './MessagesSlice'; */

interface AudioChunk {
  url: string;
  blob: Blob;
  transcription?: string;
}
export type VoiceInputProps = {
  exchangeId: string;
  interactionId: string;
  participantId: string;
  inputType: InputType;
  completed: boolean;
};

export default function VoiceInput({} /* exchangeId,
  interactionId,
  participantId,
  completed,
  inputType, */
: VoiceInputProps): ReactElement {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<AudioChunk[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);

  const transcribeAudio = async (audioBlob: Blob, index: number) => {
    // Create a FormData object to hold the audio file
    const formData = new FormData();
    formData.append('audio', audioBlob, `recording_${index}.wav`);

    try {
      // Make a POST request to the server's transcription endpoint
      const response = await fetch('http://localhost:3001/transcribe', {
        // The endpoint in your server for transcribing
        method: 'POST',
        body: formData,
      });

      // Parse the JSON response containing the transcription
      const data = await response.json();

      // Update the state with the transcription result
      setAudioChunks((prevChunks) =>
        prevChunks.map((chunk, idx) =>
          idx === index
            ? { ...chunk, transcription: data.transcription }
            : chunk,
        ),
      );
    } catch (error) {
      console.error('Error transcribing audio', error);

      // Update the state indicating there was an error in transcription
      setAudioChunks((prevChunks) =>
        prevChunks.map((chunk, idx) =>
          idx === index
            ? { ...chunk, transcription: `Error in transcription : ${error}` }
            : chunk,
        ),
      );
    }
  };

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const audioContext = new window.AudioContext({
        sampleRate: 16000,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // Create a MediaStreamSource from the stream
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);

      // Create a MediaStreamDestination
      const mediaStreamDestination =
        audioContext.createMediaStreamDestination();
      mediaStreamDestination.channelCount = 1;

      // Connect the source to the destination
      mediaStreamSource.connect(mediaStreamDestination);

      // Use the destination's stream for the MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(
        mediaStreamDestination.stream,
      );

      // mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0); // Start the recording duration counter
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          if (prevDuration >= 30) {
            handleStopRecording(); // Automatically stop recording after 30 seconds
            return prevDuration;
          }
          return prevDuration + 1;
        });
      }, 1000);
    }
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
          type: 'audio/wav',
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newChunkIndex = audioChunks.length; // Capture the index where the new chunk will be added
        const newChunk = {
          url: audioUrl,
          blob: audioBlob,
          transcription: 'Transcribing...',
        };
        setAudioChunks([...audioChunks, newChunk]);

        // Clear the recording chunks
        audioChunksRef.current = [];

        transcribeAudio(audioBlob, newChunkIndex);

        // Send the audio file to the server for transcription
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
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
    setAudioChunks(audioChunks.filter((_, i) => i !== index));
  };

  return (
    // Bottom Box
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 5,
        border: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'block',
        height: '80px',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-evenly"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ width: '100%', height: '100%' }}
      >
        {/* Microphone recording */}
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={1}
          sx={{ width: '25%', height: '100%' }}
        >
          {isRecording && (
            <Typography variant="h6" align="center" gutterBottom>
              Recording: {recordingDuration}s <br />
              <br />
            </Typography>
          )}
          {!isRecording && (
            <Typography variant="h6" align="center" gutterBottom>
              Click to record (max 30s)
            </Typography>
          )}

          <IconButton
            variant="solid"
            color="primary"
            aria-label="recording"
            onClick={toggleRecording}
          >
            {isRecording ? <MicOffRoundedIcon /> : <MicRoundedIcon />}
          </IconButton>
        </Stack>

        {/* AudioChunks display */}
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
            {audioChunks.map((chunk, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
              >
                <div>{index + 1}</div>
                <audio controls src={chunk.url} />
                <Button
                  size="sm"
                  variant="outlined"
                  color="danger"
                  onClick={() => deleteAudioChunk(index)}
                >
                  <DeleteForeverRoundedIcon />
                </Button>
              </Box>
            ))}
          </List>
        </Box>

        {/* Send button */}
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={1}
          sx={{ width: '25%', height: '100%' }}
        >
          {audioChunks.length === 1 && (
            <Typography variant="h6" align="center" gutterBottom>
              Send 1 message
            </Typography>
          )}
          {audioChunks.length > 1 && (
            <Typography variant="h6" align="center" gutterBottom>
              Send {audioChunks.length} messages
            </Typography>
          )}
          {audioChunks.length === 0 && (
            <Typography variant="h6" align="center" gutterBottom>
              Record some messages
            </Typography>
          )}

          <IconButton
            variant="solid"
            aria-label="send"
            color="success"
            disabled={audioChunks.length === 0}
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
