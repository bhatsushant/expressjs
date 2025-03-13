import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

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

app.get("/api/users", (req, res) => {
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
