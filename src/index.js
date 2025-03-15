import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id }
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next();
};

app.use(loggingMiddleware);

app.use(loggingMiddleware, (req, res, next) => {
  console.log("Finished logging route parameters...");
  next();
});

const mockUsers = [
  {
    id: 1,
    username: "sushant",
    displayName: "Sushant"
  },
  {
    id: 2,
    username: "tanay",
    displayName: "Tanay"
  },
  {
    id: 3,
    username: "harshal",
    displayName: "Harshal"
  }
];

app
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

app
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

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
