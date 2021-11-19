const dbConnect = require("../../../config/database").dbConnect;
import Business from "../../../models/business";
import User from "../../../models/user";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import bcrypt from "bcrypt";
// const ObjectId = require("mongodb").ObjectId;

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

    const { ownerPass, ownerId, employeeId, businessId, businessName } =
      req.body;

    // Check owner's password
    const owner = await User.findById({ _id: ownerId });
    const isMatch = await bcrypt.compare(ownerPass, owner.password);
    if (!isMatch) {
      console.log("Password is incorrect.");
      //   throw new Error("Password is incorrect.");
      return res.status(403).json({
        msg: "Password is incorrect.",
      });
    }

    console.log("Password is correct");

    // Update business' team
    console.log(`The business id: ${businessId}`);
    console.log(`The employee id: ${employeeId}`);
    // console.log()
    const updatedBusiness = await Business.updateOne(
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

    console.log("A member has been kicked out");
    console.log(updatedBusiness);
    // res.status(200).json({
    //   msg: `Kicking success`,
    // });

    //deletes employee's business status
    await User.findByIdAndUpdate(
      { _id: employeeId },
      {
        businessId: null,
        note: {
          msg: `You have been kicked from ${businessName}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }
    ).then((userData) => {
      console.log(`${userData.name} is kicked: `);
      console.log(userData);

      res.status(200).json({
        msg: `You have kicked ${userData.name}`,
      });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
