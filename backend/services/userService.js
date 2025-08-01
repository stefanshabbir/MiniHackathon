import * as userRepository from "../repositories/userRepository.js";

export const getAllUsers = async () => {
  const user = await userRepository.findAll();
  return user;
};
