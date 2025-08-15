const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const prisma = require("../../db/client");

module.exports = () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });
        if (user) return done(null, user);
        return done(null, false);
      }
    )
  );
};
