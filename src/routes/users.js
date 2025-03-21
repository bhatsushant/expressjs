import { Router } from "express";
import { mockUsers } from "../utils/constants.js";
import { resolveIndexByUserId } from "../utils/middlewares.js";

const router = Router();

router
  .route("/api/users")
  .get((req, res) => {
    const {
      query: { filter, value }
    } = req;
    if (filter && value)
      return res
        .status(200)
        .send(
          mockUsers.filter(user => user[filter].toLowerCase().includes(value))
        );
    return res.status(200).send(mockUsers);
  })
  .post((req, res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  });

router
  .route("/api/users/:id")
  .get(resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.status(200).send(findUser);
  })
  .put(resolveIndexByUserId, (req, res) => {
    // This will completely replace resourse with the new request body
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
  })
  .patch(resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(201);
  })
  .delete(resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
  });

export default router;
