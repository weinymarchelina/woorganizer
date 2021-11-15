const dbConnect = require("../../../config/database").dbConnect;
import Business from "../../../models/business";
import { getSession } from "next-auth/client";
import bcrypt from "bcrypt";
import nextConnect from "next-connect";

dbConnect();

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      await createBusiness(req, res);
      break;
  }
}

const createBusiness = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { name, field, phone, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    const team = [
      {
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          userId: session.userId,
          role: "owner",
        },
      },
    ];

    const data = {
      name,
      field,
      phone,
      email,
      password: hashPass,
      team,
    };

    if (!data) return res.status(400).json({ msg: "Please add data." });

    const newBusiness = new Business(data);

    await newBusiness.save();
    res.json({ msg: "Success! Create a new business acc." });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
