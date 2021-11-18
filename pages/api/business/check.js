const dbConnect = require("../../../config/database").dbConnect;
import Business from "../../../models/business";
import User from "../../../models/user";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import bcrypt from "bcrypt";

dbConnect();

export default handler.post(async (req, res) => {
  await joinBusiness(req, res);
});

const joinBusiness = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    if (!req.body) return res.status(400).json({ msg: "Please add data." });

    const { email, password } = req.body;

    const business = await Business.findOne({ email });

    if (!business) {
      throw new Error("Email or password is incorrect.");
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      console.log("Email or password is incorrect.");
      throw new Error("Email or password is incorrect.");
    }

    // Add businessId to User
    await User.findByIdAndUpdate(
      { _id: session.userId },
      { businessId: business._id }
    ).then((userData) => {
      console.log(userData);
    });

    // Update business' team
    await Business.updateOne(
      { _id: business._id },
      {
        $push: {
          team: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            userId: session.userId,
            role: "Employee",
          },
        },
      }
    )
      .then((updatedUser) => {
        console.log(updatedUser);

        const { name, field, phone, email, image, _id } = business;
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
          msg: "Success! Added you into the business!",
        });
      })
      .catch((error) => {
        res.status(500).json({ msg: `Something is Wrong: ${error.message}` });
      });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// reference
// await Business.updateOne(
//     { _id: business._id },
//     {
//       $push: {
//         team: {
//           user: {
//             name: session.user.name,
//             email: session.user.email,
//             image: session.user.image,
//             userId: session.userId,
//             role: "employee",
//           },
//         },
//       },
//     }
//   )
