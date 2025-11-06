import MessageBalloon from '@/components/chat/message/balloon/MessageBalloon';
import MessageDivider from '@/components/chat/message/balloon/MessageDivider';

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
