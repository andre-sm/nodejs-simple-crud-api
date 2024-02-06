import { User } from '../models/user-models';

const users: User[] = [];

export const addUser = (user: User): void => {
  try {
    users.push(user);
  } catch (error) {
    throw new Error('Error while adding new user');
  }
};

export const getAllUsers = (): User[] => {
  try {
    return users;
  } catch (error) {
    throw new Error('Error while getting all users');
  }
};

export const getUser = (id: string): User | undefined => {
  try {
    return users.find((user) => user.id === id);
  } catch (error) {
    throw new Error('Error while getting user by id');
  }
};

export const updateUser = (newData: User): User | null => {
  try {
    const userIndex = users.findIndex((user) => user.id === newData.id);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...newData };
      return users[userIndex];
    }
    return null;
  } catch (error) {
    throw new Error('Error while updating user');
  }
};
