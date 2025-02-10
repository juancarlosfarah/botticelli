import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import InputType from '@shared/enums/InputType';

import ScaleInput from './ScaleInput';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';

export type MessageInputProps = {
  exchangeId: string;
  interactionId: string;
  participantId: string;
  inputType: InputType;
  completed: boolean;
};

export default function MessageInput({
  inputType,
  participantId,
  exchangeId,
  interactionId,
  completed,
}: MessageInputProps): ReactElement {
  const { t } = useTranslation();
  switch (inputType) {
    case InputType.Text:
      return (
        <TextInput
          participantId={participantId}
          exchangeId={exchangeId}
          interactionId={interactionId}
          completed={completed}
          inputType={inputType}
        />
      );
    case InputType.Voice:
      return (
        <VoiceInput
          participantId={participantId}
          exchangeId={exchangeId}
          interactionId={interactionId}
          completed={completed}
          inputType={inputType}
        />
      );
    case InputType.Scale:
      return (
        <ScaleInput
          participantId={participantId}
          exchangeId={exchangeId}
          interactionId={interactionId}
          completed={completed}
          inputType={inputType}
        />
      );
    default:
      return <div>{t('No Input')}</div>;
  }
}
