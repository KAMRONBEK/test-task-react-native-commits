import { User } from '@/@types';
import asyncStorageManager from '@/utils/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
  public users: User[] = [];
  public currentUser: User | null = null;
  public isLoadingOfFetchCurrentUser = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUsers = (users: User[]) => {
    this.users = users;
  };

  addUser = (user: User) => {
    this.users.push(user);
  };

  deleteUser = (id: number) => {
    this.users = this.users.filter((user) => user.id !== id);
  };

  clearAllUsers = () => {
    this.users = [];
  };

  setCurrentUser = (user: User) => {
    this.currentUser = user;
    asyncStorageManager.setItem('currentUser', JSON.stringify(user));
  };

  clearCurrentUser = () => {
    this.currentUser = null;
    asyncStorageManager.removeItem('currentUser');
  };

  initCurrentUser = async () => {
    runInAction(() => {
      this.isLoadingOfFetchCurrentUser = true;
    });
    const user = await asyncStorageManager.getItem('currentUser');
    if (user) {
      runInAction(() => {
        this.currentUser = JSON.parse(user);
        this.isLoadingOfFetchCurrentUser = false;
      });
    }
  };

  updateUser = (user: User) => {
    this.users = this.users.map((u) => (u.id === user.id ? user : u));
  };

  get isLogged() {
    return !!this.currentUser;
  }
}

export const userStore = new UserStore();
