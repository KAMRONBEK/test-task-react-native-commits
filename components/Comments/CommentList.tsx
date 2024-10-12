import { Comment } from '@/@types';
import { commentsStore } from '@/store/comments.store';
import React, { useCallback } from 'react';
import { ListRenderItem } from 'react-native';
import RN from '../RN';
import CommentItem from './CommentItem';
import { observer } from 'mobx-react-lite';

const CommentList: React.FC = () => {
  const comments = commentsStore.comments;

  const renderComment: ListRenderItem<Comment> = useCallback(
    ({ item }) => <CommentItem {...item} />,
    [],
  );

  return (
    <RN.FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default observer(CommentList);
