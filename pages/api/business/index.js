const dbConnect = require("../../../config/database").dbConnect;
import Business from "../../../models/Business";
import User, { findByIdAndUpdate } from "../../../models/User";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import bcrypt from "bcrypt";
import { RoleContext } from "../../Contexts/RoleContext";
import { useContext } from "react";

dbConnect();

export default handler.post(async (req, res) => {
  await createBusiness(req, res);
});

const createBusiness = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const setRole = useContext(RoleContext);

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

    // Update user's roles to Owner
    await User.findByIdAndUpdate({ _id: session.userId }, { role: "owner" })
      .then((updatedUser) => {
        console.log(updatedUser);

        setRole("owner");

        res.status(200).json({ msg: "Success! Updated your role." });
      })
      .catch((error) => {
        res.status(500).json({ msg: `Something is Wrong: ${error.message}` });
      });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
