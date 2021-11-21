import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import bcrypt from "bcrypt";
const User = require("../../../models/User");
import dbConnect from "../../../db/database";

dbConnect();

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
    }),
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        name: {
          label: "Name",
          type: "text",
          placeholder: "New user? Input name here",
        },
        email: {
          label: "Email",
          type: "email ",
          placeholder: "entrepreneur@cool.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { name, email, password } = credentials;
        const user = await User.findOne({ email });

        if (user) {
          return checkUser({ password, user });
        }

        return registerUser({ email, password, name });
      },
    }),
  ],
  jwt: {
    encryption: true,
  },
  secret: process.env.SECRET,
  database: process.env.DB_STRING,
  callbacks: {
    session: async (session, user) => {
      session.userId = user.sub;

      return Promise.resolve(session);
    },
  },
});

const checkUser = async ({ password, user }) => {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Email or password is incorrect.");
    throw new Error("Email or password is incorrect.");
  }

  return user;
};

const registerUser = async ({ email, password, name }) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashPass });
    await newUser.save();
    return newUser;
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err,
    });
  }
};
