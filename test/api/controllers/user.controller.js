import * as userService from "../services/user.service.js";

export async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();

    res.json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
