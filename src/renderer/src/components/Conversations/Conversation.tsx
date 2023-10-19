import { useParams } from 'react-router-dom';
type Props = {};

export default function Conversation({}: Props): JSX.Element {
  const { conversationId } = useParams();
  console.log(conversationId);
  return <div></div>;
}
