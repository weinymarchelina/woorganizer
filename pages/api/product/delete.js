import dbConnect from "../../../db/database";
import Product from "../../../models/product";
import { getSession } from "next-auth/client";
import handler from "../../handler";

dbConnect();

export default handler.post(async (req, res) => {
  await deleteItems(req, res);
});

const deleteItems = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { itemId, businessId } = await req.body;

    if (!req.body) return res.status(400).json({ msg: "Please add data." });
    if (!businessId) {
      console.log("Where is the id??");
      console.log(businessId);
    }

    await Product.updateOne(
      { businessId },
      {
        $pull: {
          product: {
            _id: itemId,
          },
        },
      },
      {
        multi: true,
      }
    );

    // console.log(result);

    const products = await Product.findOne({
      businessId,
    });

    res.status(200).json({
      products,
      msg: "Item is successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
