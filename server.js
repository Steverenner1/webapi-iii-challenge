const express = require("express");
const helmet = require("helmet");

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

server.use(helmet());
server.use(express.json());
server.use("/users", userRouter);
server.use("/posts", postRouter);
server.use(logger);

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get("host")}`);

  next();

};

module.exports = server;
