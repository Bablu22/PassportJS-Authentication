const express = require("express");
const routes = require("./routes/user");
const cors = require("cors");
require("dotenv").config();
require("./config/database");
require("./config/passport");

const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cors());
app.set("view engine", "ejs");

app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzt34uk.mongodb.net/passport-auth`,
      collectionName: "sessions",
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});
app.use("/user", routes);

app.use((err, _req, res, _next) => {
  const message = err.message ? err.message : "Server Error Occured";
  res.status(500).json({ message: message });
});

module.exports = app;
