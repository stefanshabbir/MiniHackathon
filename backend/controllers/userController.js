import { getAllUsers } from "../services/userService.js";

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    console.log(users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
