import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad Request. Invalid ID" });
  const findUser = mockUsers.find(user => user.id === parsedId);
  console.log(findUser);
  if (!findUser) return res.sendStatus(404);
  return res.status(200).send(findUser);
});

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
