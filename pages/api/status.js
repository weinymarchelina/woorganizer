const dbConnect = require("../../config/database").dbConnect;
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
    let role = "Employee";

    const user = await User.findOne({
      _id: userId,
    });

    if (user?.role === "Owner") {
      role = "Owner";
    }

    if (!user.businessId) {
      console.log("No Business here:");
      console.log(user?.businessId);

      console.log();

      return res.status(200).json({
        currentRole: role,
        businessInfo: null,
        note: user.note,
      });
    }

    const business = await Business.findOne({
      _id: user.businessId,
    });

    const { name, field, phone, email, image, team, _id } = business;

    const businessInfo = {
      name,
      field,
      phone,
      email,
      image,
      team,
      _id,
    };

    res.status(200).json({
      currentRole: role,
      businessInfo,
      msg: user.note?.msg,
    });
  } catch (err) {
    console.log("Alert!");
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
