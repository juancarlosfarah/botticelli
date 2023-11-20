import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/joy/Button';

import ConversationList from './ConversationList.tsx';
import ConversationTable from './ConversationTable.tsx';
import { fetchConversations } from './ConversationsSlice';

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
