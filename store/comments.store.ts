import { Comment, CommentParamsType } from '@/@types';
import { makeAutoObservable } from 'mobx';

class CommentsStore {
  public comments: Comment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setComments = (comments: Comment[]) => {
    this.comments = comments;
  };

  addComment = (comment: CommentParamsType) => {
    const newComment = {
      id: this.lastCommentId + 1,
      timestamp: new Date().toISOString(),
      parent_id: null,
      ...comment,
    };
    this.comments.push(newComment);
  };

  deleteComment = (id: number) => {
    this.comments = this.comments.filter((comment) => comment.id !== id);
  };

  get lastCommentId() {
    return this.comments.length
      ? this.comments[this.comments.length - 1].id
      : 0;
  }

  clearAllComments = () => {
    this.comments = [];
  };
}

export const commentsStore = new CommentsStore();
