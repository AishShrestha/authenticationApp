const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../database/database.config.js");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    // user authentication logic
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      console.log(user);
      if (!user) {
        return done(null, false, { message: "Doesn't match required credencials" });
      } else {
        const passwordMatch = bcrypt.compare(user.password, password);
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      }
    } catch (err) {
      console.log(err);
      return done(null, false, { message: "Something went wrong" });
    }
  })
);


module.exports = passport;
