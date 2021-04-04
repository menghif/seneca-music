const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const dotenv = require("dotenv");

dotenv.config();

const userService = require("./user-service.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use(passport.initialize());
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
      secretOrKey: process.env.JWT_SECRET,
    },
    function verify(payload, done) {
      if (!payload) {
        return done(null, false);
      }

      done(null, { _id: payload._id, userName: payload.userName });
    }
  )
);

function createToken(user) {
  const payload = { userName: user.userName, _id: user._id };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || "3d" };

  return jwt.sign(payload, secret, options);
}

/* TODO Add Your Routes Here */
app.post("/api/register", (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.post("/api/login", (req, res) => {
  userService
    .checkUser(req.body)
    .then((user) => {
      res.json({ message: "login successful", token: createToken(user) });
    })
    .catch((msg) => {
      res.status(422).json({ message: msg });
    });
});

app.get(
  "/api/user/favourites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .getFavourites(req.user._id)
      .then((favourites) => {
        res.json(favourites);
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  }
);

app.post(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .addFavourite(req.user._id, req.params.id)
      .then((favourites) => {
        res.json(favourites);
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  }
);

app.delete(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .removeFavourite(req.user._id, req.params.id)
      .then((favourites) => {
        res.json(favourites);
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  }
);

userService
  .connect()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("API listening on: " + HTTP_PORT);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
