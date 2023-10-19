import ConversationTable from './ConversationTable.tsx';
import ConversationList from './ConversationList.tsx';
import Button from '@mui/joy/Button';
import { fetchConversations, saveNewConversation } from './ConversationsSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Conversations(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchConversations());
  }, []);

  const handleNewConversation = async (): Promise<void> => {
    const { payload } = await dispatch(saveNewConversation());
    console.debug(payload);
    if (payload.id) {
      navigate(`/conversation/${payload.id}`);
    }
  };

  return (
    <div>
      <Button onClick={handleNewConversation}>New Conversation</Button>
      <ConversationTable />
      <ConversationList />
    </div>
  );
}
