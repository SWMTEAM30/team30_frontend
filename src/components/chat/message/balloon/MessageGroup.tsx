import MessageBalloon from './MessageBalloon';
import MessageDivider from './MessageDivider';

interface MessageGroup {
  id: string;
  mainPost: Message;
  replies: Message[];
  timestamp: Date;
  isNewSession?: boolean;
}

interface MessageGroupProps {
  group: MessageGroup;
  showDivider?: boolean;
}

export default function MessageGroup({ group, showDivider = true }: MessageGroupProps) {
  return (
    <div className="w-full">
      {showDivider && <MessageDivider />}
      <MessageBalloon message={group.mainPost} isMainPost={true} replies={group.replies} />
    </div>
  );
}
