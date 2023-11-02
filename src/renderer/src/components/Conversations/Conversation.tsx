import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';

import log from 'electron-log/renderer';

import MessagesPane from '../Messages/MessagesPane';
import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import {
  fetchConversation,
  selectConversationById,
} from './ConversationsSlice';

export default function Conversation(): ReactElement {
  const { conversationId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: conversationId };
    log.debug(`fetching conversation ${conversationId}`);
    dispatch(fetchConversation(query));
    dispatch(fetchMessages({ conversationId }));
  }, [conversationId]);

  const conversation = useSelector((state) =>
    selectConversationById(state, conversationId),
  );

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
