import { Comment } from '@/@types';
import { makeAutoObservable } from 'mobx';

class CommentsStore {
  public comments: Comment[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setComments = (comments: Comment[]) => {
    this.comments = comments;
  };

  addComment = (comment: Comment) => {
    this.comments.push(comment);
  };

  deleteComment = (id: number) => {
    this.comments = this.comments.filter((comment) => comment.id !== id);
  };

  clearAllComments = () => {
    this.comments = [];
  };
}

export const commentsStore = new CommentsStore();
