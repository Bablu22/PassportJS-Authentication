const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/register", (req, res, next) => {
  res.render("register");
});
router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/private", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render("profile");
  }
  res.redirect("/user/login");
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

const checkedLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/user/private");
  }
  next();
};

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

module.exports = router;
