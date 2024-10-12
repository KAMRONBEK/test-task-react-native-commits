/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Avatar, Card, Button } from 'react-native-paper';
import moment from 'moment';
import { Comment, CommentParamsType } from '@/@types';
import { userStore } from '@/store/user.store';
import { observer } from 'mobx-react-lite';
import useComments from '@/hooks/useComments';
import RN from '../RN';
import { COLORS } from '@/constants/colors';

// Type for Comment with children (for nested replies)
interface CommentProps extends Comment {
  replies?: Comment[]; // Nested replies
}

const CommentItem: React.FC<CommentProps> = ({
  id,
  message,
  timestamp,
  userId,
  parent_id,
  replies = [],
}) => {
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyList, setReplyList] = useState<Comment[]>(replies);
  const {
    createReplayCommentHandler,
    fetchAllReplayCommentsHandler,
    isLoadingOfCreateReplayComment,
    isLoadingOfFetchAllReplayComments,
  } = useComments();

  // Fetch the user by their ID from the user store
  const user = useMemo(() => userStore.findUserById(userId), [userId]);

  // Format the timestamp into a readable date
  const formattedDate = useMemo(
    () => moment.utc(timestamp).local().fromNow(),
    [timestamp],
  );

  const fetchAllReplayComments = useCallback(async () => {
    await fetchAllReplayCommentsHandler(id, (replies) => {
      setReplyList(replies);
    });
  }, [fetchAllReplayCommentsHandler, id]);

  const handleReplySubmit = useCallback(async () => {
    const replyComment: CommentParamsType = {
      message: replyMessage,
      parent_id: id,
      // Add other required fields for the comment here, like userId
      userId: userStore.currentUser?.id || 0, // Assuming you have the current user in userStore
    };

    await createReplayCommentHandler(replyComment, () => {
      // Update the reply list after successful submission
      setReplyList((prevReplies) => [
        ...prevReplies,
        {
          ...replyComment,
          id: Date.now(),
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    // Reset reply input
    setReplyTo(null);
    setReplyMessage('');
  }, [createReplayCommentHandler, id, replyMessage]);

  useEffect(() => {
    fetchAllReplayComments();
  }, []);

  if (isLoadingOfFetchAllReplayComments || !user) {
    return (
      <RN.View style={styles.loadingContainer}>
        <RN.ActivityIndicator />
      </RN.View>
    );
  }

  return (
    <Card style={styles.commentCard}>
      <Card.Content>
        <RN.View style={styles.commentHeader}>
          {/* Avatar */}
          {user ? (
            <Avatar.Text
              size={40}
              label={user.username.charAt(0)}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Icon size={40} icon={'account'} style={styles.avatar} />
          )}

          {/* Username and timestamp */}
          <RN.View style={styles.commentInfo}>
            <RN.Text style={styles.username}>
              {user ? user.username : 'Unknown User'}
            </RN.Text>
            <RN.Text style={styles.timestamp}>{formattedDate}</RN.Text>
          </RN.View>
        </RN.View>

        {/* Comment message */}
        <RN.Text style={styles.commentMessage}>{message}</RN.Text>

        {/* Reply button */}
        <Button mode={'text'} onPress={() => setReplyTo(id)}>
          {'Reply'}
        </Button>

        {/* Reply input (only shown when replying) */}
        {replyTo === id && (
          <RN.View style={styles.replyInputContainer}>
            <RN.TextInput
              placeholder={'Write a reply...'}
              value={replyMessage}
              onChangeText={setReplyMessage}
              style={styles.replyInput}
            />
            <Button
              mode={'contained'}
              onPress={handleReplySubmit}
              disabled={isLoadingOfCreateReplayComment} // Disable while loading
            >
              {'Submit'}
            </Button>
          </RN.View>
        )}

        {/* Render nested replies */}
        {replyList && replyList.length > 0 && (
          <RN.View style={styles.repliesContainer}>
            {replyList.map((reply) => (
              <CommentItem key={reply.id} {...reply} />
            ))}
          </RN.View>
        )}
      </Card.Content>
    </Card>
  );
};

// Styles for the component
const styles = RN.StyleSheet.create({
  commentCard: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: COLORS.orange,
  },
  commentInfo: {
    marginLeft: 12,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: '#777',
  },
  commentMessage: {
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 20,
  },
  replyInputContainer: {
    marginTop: 12,
  },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  repliesContainer: {
    marginLeft: 20, // Indent replies
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default observer(CommentItem);
