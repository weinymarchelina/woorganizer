import dbConnect from "../../../db/database";
import Product from "../../../models/product";
import { getSession } from "next-auth/client";
import handler from "../../handler";

dbConnect();

export default handler.post(async (req, res) => {
  await addItems(req, res);
});

const addItems = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { items, businessId } = await req.body;

    if (!items) return res.status(400).json({ msg: "Please add data." });

    const product = await Product.updateOne(
      { businessId },
      {
        $push: {
          product: {
            $each: items,
          },
        },
      }
    );
    res.status(200).json({
      product,
      msg: "Items are successfully added",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
