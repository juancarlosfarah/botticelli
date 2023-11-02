import { useParams } from 'react-router-dom';
import MessagesPane from '../Messages/MessagesPane';

import { ReactElement, useEffect } from 'react';
import { fetchConversation, selectConversationById } from './ConversationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

export default function Conversation(): ReactElement {
  const { conversationId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: conversationId };
    console.debug(`fetching conversation ${conversationId}`);
    dispatch(fetchConversation(query));
    dispatch(fetchMessages({ conversationId }));
  }, [conversationId]);

  const conversation = useSelector((state) => selectConversationById(state, conversationId));

  if (!conversation) {
    return <div>Conversation Not Found</div>;
  }

  return (
    <>
      <CustomBreadcrumbs />
      <Box
        sx={{
          display: 'flex',
          my: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2">{`Conversation #${conversationId}`}</Typography>
      </Box>
      <Typography sx={{}} level="title-md">
        Description
      </Typography>
      <Typography>{conversation.description}</Typography>
      <Typography sx={{ mt: 1 }} level="title-md">
        Instructions
      </Typography>
      <Typography>{conversation.instructions}</Typography>
      <MessagesPane conversation={conversation} />
    </>
  );
}
