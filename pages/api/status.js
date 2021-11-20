import dbConnect from "../../db/database";
import User from "../../models/user";
import Business from "../../models/business";
import { getSession } from "next-auth/client";
import handler from "../handler";

dbConnect();

export default handler.get(async (req, res) => {
  await checkStatus(req, res);
});

const checkStatus = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { userId } = session;
    const user = await User.findOne({
      _id: userId,
    });
    const role = user.role;

    if (!user.businessId) {
      return res.status(200).json({
        currentRole: role,
        businessInfo: null,
      });
    }

    const business = await Business.findOne({
      _id: user.businessId,
    });
    res.status(200).json({
      currentRole: role,
      businessInfo: business,
    });
  } catch (err) {
    console.log("Alert!");
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
