import { User } from '../models/user-models';

const users: User[] = [];

export const addUser = (user: User): void => {
  try {
    users.push(user);
  } catch (error) {
    throw new Error('Error while adding new user');
  }
};
