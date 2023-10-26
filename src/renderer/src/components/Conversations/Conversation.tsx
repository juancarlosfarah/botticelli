import { useParams } from 'react-router-dom';
import MessagesPane from '../Messages/MessagesPane';
type Props = {};

import { useEffect } from 'react';
import { fetchConversation, selectConversationById } from './ConversationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '../Messages/MessagesSlice';
import CustomBreadcrumbs from '../layout/CustomBreadcrumbs';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

export default function Conversation({}: Props): JSX.Element {
  const { conversationId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = { id: conversationId };
    console.log(`fetching conversation ${conversationId}`);
    dispatch(fetchConversation(query));
    dispatch(fetchMessages({ conversationId }));
  }, [conversationId]);

  const conversation = useSelector((state) => selectConversationById(state, conversationId));
  console.log('conversation 20:', conversation);
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
        {/*<Button color="primary" startDecorator={<DownloadRoundedIcon />} size="sm">*/}
        {/*  Download PDF*/}
        {/*</Button>*/}
      </Box>
      <MessagesPane conversation={conversation} />
    </>
  );
}
