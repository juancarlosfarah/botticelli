import ConversationTable from './ConversationTable.tsx';
import ConversationList from './ConversationList.tsx';
import Button from '@mui/joy/Button';
import { POST_CONVERSATION_CHANNEL } from '../../../../shared/channels';
import { IpcService } from '../../services/IpcService';

export default function Conversations(): JSX.Element {
  const handleNewConversation = async (): Promise<void> => {
    const res = await IpcService.send<{ hello: string }>(POST_CONVERSATION_CHANNEL);
    console.log(res);
  };
  return (
    <div>
      <Button onClick={handleNewConversation}>New Conversation</Button>
      <ConversationTable />
      <ConversationList />
    </div>
  );
}
