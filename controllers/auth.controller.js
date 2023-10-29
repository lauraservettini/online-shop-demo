const db = require("../data/database");
const User = require("../models/user.models");
const authUtil = require("../util/authentication");
const valUtil = require("../util/validation");
const sessionFlashUtil = require("../util/session-flash");

function getSignup(req, res) {
  //riprendo i dati da util session-data
  let sessionData = sessionFlashUtil.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      street: "",
      postalCode: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}

async function postSignup(req, res, next) {
  const userData = {
    email: req.body.email,
    confirmEmail: req.body.confirmEmail,
    password: req.body.password,
    fullName: req.body.fullName,
    street: req.body.street,
    postalCode: req.body.postalCode,
    city: req.body.city,
  };
  if (
    !valUtil.userDetailIsValid(
      userData.email,
      userData.password,
      userData.fullName,
      userData.street,
      userData.postalCode,
      userData.city
    ) ||
    !valUtil.emailIsConfirmed(userData.email, userData.confirmEmail)
  ) {
    sessionFlashUtil.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password must be at least 6 characters long!",
        ...userData,
      },
      function () {}
    );
    res.redirect("/signup");
    return;
  }
  const newUser = new User(
    userData.email,
    userData.password,
    userData.fullName,
    userData.street,
    userData.postalCode,
    userData.city
  );

  let existAlready;
  try {
    existAlready = await newUser.existsAlready();
  } catch (error) {
    return next(error);
  }

  if (existAlready) {
    sessionFlashUtil.flashDataToSession(
      req,
      {
        errorMessage: "This email is already signup!",
        ...userData,
      }
    );
    res.redirect("/signup");
    return;
  }

  try {
    await newUser.signup();
  } catch (error) {
    return next(error); 
  }
  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlashUtil.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { inputData: sessionData });
}

async function postLogin(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }
  
  //avviare sessione con dati login
  if (!existingUser) {
    sessionFlashUtil.flashDataToSession(
      req,
      {
        errorMessage:
          "Invalid credentials, please check your email and your password!",
        email: user.email,
        password: user.password,
      }
    );
  
    res.redirect("/login");
    return;
  }
  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.comparePassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!passwordIsCorrect) {
    sessionFlashUtil.flashDataToSession(
      req,
      {
        errorMessage:
          "Invalid credentials, please check your email and your password!",
        email: user.email,
        password: user.password,
      }
    );
    res.redirect("/login");
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    if(existingUser.isAdmin){
      res.redirect("/admin/products");
    }
    else {
      res.redirect("/");
    }
  });
}

function logout(req, res) {
  authUtil.cancelSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  postSignup: postSignup,
  getLogin: getLogin,
  postLogin: postLogin,
  logout: logout,
};
