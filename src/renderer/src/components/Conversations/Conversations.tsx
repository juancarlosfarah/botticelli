import ConversationTable from './ConversationTable.tsx';
import ConversationList from './ConversationList.tsx';
import Button from '@mui/joy/Button';
import { fetchConversations } from './ConversationsSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Conversations(): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchConversations());
  }, []);

  return (
    <div>
      <Button color="primary" to="/conversations/new" component={RouterLink}>
        New Conversation
      </Button>
      <ConversationTable />
      <ConversationList />
    </div>
  );
}
