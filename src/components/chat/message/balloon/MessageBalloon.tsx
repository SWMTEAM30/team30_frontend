import MainPost from '@/components/chat/message/balloon/MainPost';
import SingleMessage from '@/components/chat/message/balloon/SingleMessage';
import { useCodinationSave } from '@/hooks/useCodinationSave';

export default function MessageBalloon({
  message,
  isMainPost = false,
  replies = [],
}: {
  message: Message;
  isMainPost?: boolean;
  replies?: Message[];
}) {
  const isUserId = !!message.user;
  // 본 글은 사용자, 댓글은 AI
  const isUser = isMainPost ? true : false;

  const { addCodinationFromProducts, isSaved } = useCodinationSave();

  return (
    <div className="w-full">
      {isMainPost ? (
        <MainPost message={message} replies={replies} onSaveCodination={addCodinationFromProducts} isSaved={isSaved} />
      ) : (
        <SingleMessage
          message={message}
          isUser={isUser}
          onSaveCodination={addCodinationFromProducts}
          isSaved={isSaved}
        />
      )}
    </div>
  );
}
