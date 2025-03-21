import express from "express";
import routes from "./routes/index.js";
import { loggingMiddleware } from "./utils/middlewares.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.use(loggingMiddleware);

app.use(loggingMiddleware, (req, res, next) => {
  console.log("Finished logging route parameters...");
  next();
});

app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
