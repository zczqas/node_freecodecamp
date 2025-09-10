const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let users = [];
let exercises = [];
let userIdCounter = 1;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.json({ error: "Username is required" });
  }

  const newUser = {
    username: username,
    _id: userIdCounter.toString(),
  };

  users.push(newUser);
  userIdCounter++;

  res.json({ username: newUser.username, _id: newUser._id });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  const user = users.find((u) => u._id === userId);
  if (!user) {
    return res.json({ error: "User not found" });
  }

  if (!description || !duration) {
    return res.json({ error: "Description and duration are required" });
  }

  let exerciseDate;
  if (date) {
    exerciseDate = new Date(date);
  } else {
    exerciseDate = new Date();
  }

  const exercise = {
    userId: userId,
    description: description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString(),
  };

  exercises.push(exercise);

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id,
  });
});

app.get("/api/users/:_id/logs", (req, res) => {
  const userId = req.params._id;
  const { from, to, limit } = req.query;

  const user = users.find((u) => u._id === userId);
  if (!user) {
    return res.json({ error: "User not found" });
  }

  let userExercises = exercises.filter((ex) => ex.userId === userId);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter((ex) => new Date(ex.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter((ex) => new Date(ex.date) <= toDate);
  }

  if (limit) {
    const limitNum = parseInt(limit);
    userExercises = userExercises.slice(0, limitNum);
  }

  const log = userExercises.map((ex) => ({
    description: ex.description,
    duration: ex.duration,
    date: ex.date,
  }));

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
