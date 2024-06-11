var cors = require("cors");
import express, { NextFunction, Request, Response } from "express";
import auth from "./auth";

const app = express();

app.use(cors());

let users = [
  {
    id: "1234",
    firebaseId: "eQzdhJQp4qQtPV1H04gFYERG3Jp1",
    email: "jakewhatever",
    name: "Jake from Database (no khakis)",
  },
];

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // headers = { ..., authorization: "Bearer ${token}" }
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "You don't belong here. Who do you know here?" });
  }

  const details = await auth.verifyIdToken(token);

  const user = users.find((user) => user.firebaseId === details.uid);

  req["user"] = user;

  next();
};

app.get(
  "/",
  requireAuth,
  (req, res, next) => {
    // ip logging
    console.log(req.ip);
    next();
  },
  (req, res) => {
    console.log(req.user);
    res.send(`Hey ${req.user?.name}`);
  }
);

app.post(
  "/",
  requireAuth,
  (req, res, next) => {
    // ip logging
    console.log(req.ip);
    next();
  },
  (req, res) => {
    console.log(req.user);
    res.send(`Hey ${req.user?.name}`);
  }
);

const PORT = 3005;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
