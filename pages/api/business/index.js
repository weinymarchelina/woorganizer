import dbConnect from "../../../db/database";
import Business from "../../../models/business";
import Inventory from "../../../models/inventory";
import Product from "../../../models/product";
import Invoice from "../../../models/invoice";
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

    //
    const acc = await Business.findOne({ email });
    if (acc) {
      return res.status(400).json({ msg: "Email has already been taken!" });
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
    //
    const product = {
      businessId: resBusiness._id,
      product: [],
    };
    await new Product(product).save();
    //
    const invoice = {
      businessId: resBusiness._id,
      invoice: [],
    };
    await new Invoice(invoice).save();

    // Update user's roles to Owner
    await User.findByIdAndUpdate(
      { _id: session.userId },
      { role: "Owner", businessId: resBusiness._id }
    )
      .then(() => {
        res.status(200).json({
          businessData: resBusiness,
        });
      })
      .catch((error) => {
        res.status(500).json({ msg: `Something is Wrong: ${error.message}` });
      });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
