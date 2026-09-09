import { AppError } from "../utils/AppError.js";

const users = [
  {
    id: "1",
    name: "Arip",
    email: "arip@example.com",
  },
];

export async function getUsers() {
  return users;
}

export async function getUserById(id) {
  const user = users.find((user) => user.id === id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function createUser(data) {
  const { name, email } = data;

  if (!name || !email) {
    throw new AppError("name and email are required", 400);
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
  };

  users.push(user);

  return user;
}
