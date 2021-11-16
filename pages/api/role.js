const dbConnect = require("../../config/database").dbConnect;
import User from "../../models/user";
import { getSession } from "next-auth/client";
import handler from "../handler";

dbConnect();

export default handler.get(async (req, res) => {
  await checkRole(req, res);
});

const checkRole = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { userId } = session;
    let role = "employee";

    await User.findOne({
      _id: userId,
    }).then((newUser) => {
      if (newUser?.role === "owner") {
        role = "owner";
      }
    });

    res.status(200).json({
      currentRole: role,
      msg: `Role checking done! Your role is ${role}.`,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
