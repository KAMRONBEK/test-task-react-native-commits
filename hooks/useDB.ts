import { User, UserParamsType } from '@/@types';
import { useSQLiteContext } from 'expo-sqlite';
import { delay } from 'lodash';

const DELAYED_TIME = 1_000;

const useDB = () => {
  const db = useSQLiteContext();

  const userActions = {
    fetchUsers: () =>
      new Promise(async (resolve, reject) => {
        try {
          const users = await db.getAllAsync<User>('SELECT * FROM users');
          delay(() => resolve(users), DELAYED_TIME);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      }),
    createUser: (user: UserParamsType) =>
      new Promise(async (resolve, reject) => {
        try {
          const existingUser = await db.getFirstAsync<User>(
            `SELECT * FROM users WHERE email = '${user.email}'`,
          );

          if (existingUser) {
            return reject(new Error('This email is already in use'));
          }

          await db.execAsync(
            `INSERT INTO users (username, email) VALUES ('${user.username}', '${user.email}')`,
          );
          delay(() => resolve(true), DELAYED_TIME);
        } catch (error) {
          reject(error);
        }
      }),
    loginUser: (email: string) =>
      new Promise(async (resolve, reject) => {
        try {
          const user = await db.getFirstAsync<User>(
            `SELECT * FROM users WHERE email = '${email}'`,
          );

          if (!user) {
            return reject(new Error('User not found'));
          }

          delay(() => resolve(true), DELAYED_TIME);
        } catch (error) {
          reject(error);
        }
      }),
    updateUser: (user: User) =>
      new Promise(async (resolve, reject) => {
        try {
          await db.execAsync(
            `UPDATE users SET username = '${user.username}', email = '${user.email}' WHERE id = ${user.id}`,
          );
          delay(() => resolve(true), DELAYED_TIME);
        } catch (error) {
          reject(error);
        }
      }),
    deleteUser: (id: number) =>
      new Promise(async (resolve, reject) => {
        try {
          await db.execAsync(`DELETE FROM users WHERE id = ${id}`);
          delay(() => resolve(true), DELAYED_TIME);
        } catch (error) {
          reject(error);
        }
      }),
  };

  return { ...userActions };
};

export default useDB;
