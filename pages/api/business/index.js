const dbConnect = require("../../../config/database").dbConnect;
import Business from "../../../models/business";
import Inventory from "../../../models/inventory";
import User from "../../../models/user";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import bcrypt from "bcrypt";

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

    const { name, field, phone, email, password } = await req.body;

    // check for same email
    const acc = await Business.findOne({ email });
    if (acc) {
      return res.status(400).json({ msg: "Email has already taken!" });
    }

    // hash password
    const salt = await bcrypt.genSalt();
    const hashPass = await bcrypt.hash(password, salt);

    const team = [
      {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        userId: session.userId,
        role: "Owner",
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

    // save business
    const newBusiness = new Business(data);
    const resBusiness = await newBusiness.save();

    // create others collection
    const inventory = {
      businessId: resBusiness._id,
      inventory: [],
    };
    await new Inventory(inventory).save();

    // Update user's roles to Owner
    await User.findByIdAndUpdate(
      { _id: session.userId },
      { role: "Owner", businessId: resBusiness._id }
    )
      .then((newUserData) => {
        console.log(newUserData);
        console.log(resBusiness);

        const { name, field, phone, email, image, _id } = resBusiness;
        const businessData = {
          name,
          field,
          phone,
          email,
          image,
          _id,
        };

        res.status(200).json({
          businessData,
        });
      })
      .catch((error) => {
        res.status(500).json({ msg: `Something is Wrong: ${error.message}` });
      });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
