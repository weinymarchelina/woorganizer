import dbConnect from "../../../db/database";
import Business from "../../../models/business";
import User from "../../../models/user";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import bcrypt from "bcrypt";

dbConnect();

export default handler.post(async (req, res) => {
  await kickEmployee(req, res);
});

const kickEmployee = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    if (!req.body) return res.status(400).json({ msg: "Please add data." });

    const { ownerPass, ownerId, employeeId, businessId } = req.body;

    const owner = await User.findById({ _id: ownerId });
    const isMatch = await bcrypt.compare(ownerPass, owner.password);
    if (!isMatch) {
      return res.status(403).json({
        msg: "Password is incorrect.",
      });
    }

    await Business.updateOne(
      { _id: businessId },
      {
        $pull: {
          team: {
            userId: employeeId,
          },
        },
      },
      {
        multi: true,
      }
    );

    await User.findByIdAndUpdate(
      { _id: employeeId },
      {
        businessId: null,
      }
    ).then((userData) => {
      res.status(200).json({
        msg: `You have kicked ${userData.name}`,
      });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
