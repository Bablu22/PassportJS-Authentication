const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const GoogleUser = require("../models/google-user");

router.get("/register", (req, res, next) => {
  res.render("register");
});

const checkedLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/private");
  }
  next();
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/login");
};

router.get("/login", checkedLogin, (req, res, next) => {
  res.render("login");
});

router.get("/private", checkAuthenticated, async (req, res, next) => {
  // if (req.isAuthenticated()) {
  //   res.render("profile");
  // }

  // const googleUser = await GoogleUser.findOne({ username: username });
  res.render("profile");
  // res.redirect("/user/login");
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hash,
    });
    newUser.save();
    res.redirect("/user/login");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    successRedirect: "/user/private",
  })
);

router.get("/logout", (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// google log in

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login",
    successRedirect: "/user/private",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.send("Hi");
  }
);

module.exports = router;
