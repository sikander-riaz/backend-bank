const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./models/queries");
const port = 3002;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// app.options(
//   "/login",
//   cors({
//     methods: ["GET", "POST", "PUT"],
//   })
// );

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

// for signup
app.post("/users", db.createUser);
// signin
app.post("/login", db.getUserByEmail);
app.get("/users", db.getAllUsers);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
