import React, { useState, useMemo } from 'react';
import { Avatar, Card, Button } from 'react-native-paper';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import moment from 'moment';
import { Comment } from '@/@types';
import { userStore } from '@/store/user.store';
import { observer } from 'mobx-react-lite';

const CommentItem: React.FC<Comment> = ({
  id,
  message,
  timestamp,
  userId,
  parent_id,
}) => {
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [replyTo, setReplyTo] = useState<number | null>(null);

  // Fetch the user by their ID from the user store
  const user = useMemo(() => userStore.findUserById(userId), [userId]);

  // Format the timestamp into a readable date
  const formattedDate = useMemo(
    () => moment.utc(timestamp).local().fromNow(),
    [timestamp],
  );

  return (
    <Card style={styles.commentCard}>
      <Card.Content>
        <View style={styles.commentHeader}>
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
          <View style={styles.commentInfo}>
            <Text style={styles.username}>
              {user ? user.username : 'Unknown User'}
            </Text>
            <Text style={styles.timestamp}>{formattedDate}</Text>
          </View>
        </View>

        {/* Comment message */}
        <Text style={styles.commentMessage}>{message}</Text>

        {/* Reply button */}
        <Button mode={'text'} onPress={() => setReplyTo(id)}>
          {'Reply'}
        </Button>

        {/* Reply input (only shown when replying) */}
        {replyTo === id && (
          <View style={styles.replyInputContainer}>
            <TextInput
              placeholder={'Write a reply...'}
              value={replyMessage}
              onChangeText={setReplyMessage}
              style={styles.replyInput}
            />
            <Button
              mode={'contained'}
              onPress={() => {
                // Handle reply submission logic here
                setReplyTo(null);
                setReplyMessage('');
              }}
            >
              {'Submit'}
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

// Styles for the component
const styles = StyleSheet.create({
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
    backgroundColor: '#6200ea',
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
});

export default observer(CommentItem);
