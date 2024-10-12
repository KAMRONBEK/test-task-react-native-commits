import { CommentParamsType, Comment } from '@/@types';
import useDB from './useDB';
import useVisibility from './useVisibility';
import { useCallback } from 'react';
import { commentsStore } from '@/store/comments.store';
import { isEmpty } from 'lodash';

const useComments = () => {
  const { createComment, fetchComments } = useDB();
  const loadingOfCreateComment = useVisibility();
  const loadingOfFetchAllComments = useVisibility();

  const createCommentHandler = useCallback(
    async (comment: CommentParamsType, callback?: () => void) => {
      loadingOfCreateComment.show();
      try {
        const isSuccess = await createComment(comment);
        if (isSuccess) {
          commentsStore.addComment(comment);
          callback && callback();
        }
      } catch (err) {
        console.error(err);
      } finally {
        loadingOfCreateComment.hide();
      }
    },
    [createComment, loadingOfCreateComment],
  );

  const fetchAllCommentsHandler = useCallback(async () => {
    loadingOfFetchAllComments.show();
    try {
      const comments = await fetchComments();
      if (!isEmpty(comments)) {
        commentsStore.setComments(comments as Comment[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingOfFetchAllComments.hide();
    }
  }, [fetchComments, loadingOfFetchAllComments]);

  return {
    createCommentHandler,
    fetchAllCommentsHandler,
    isLoadingOfCreateComment: loadingOfCreateComment.visible,
    isLoadingOfFetchAllComments: loadingOfFetchAllComments.visible,
  };
};

export default useComments;
