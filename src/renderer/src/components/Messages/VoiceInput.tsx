import { ReactElement } from 'react';

import InputType from '@shared/enums/InputType';

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
  return (
    <div style={{ margin: 50 }}>
      <pre>Input Type: {inputType}</pre>
      <pre>Exchange ID: {exchangeId}</pre>
      <pre>Interaction ID: {interactionId}</pre>
      <pre>Participant ID: {participantId}</pre>
      <pre>Completed: {completed}</pre>
    </div>
  );
}
