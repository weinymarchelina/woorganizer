import dbConnect from "../../../db/database";
import Invoice from "../../../models/invoice";
import Product from "../../../models/product";
import { getSession } from "next-auth/client";
import handler from "../../handler";

dbConnect();

export default handler.post(async (req, res) => {
  await addInvoice(req, res);
});

const addInvoice = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { cashier, total, customer, storage, businessId } = await req.body;

    if (!req.body) return res.status(400).json({ msg: "Please add data." });

    const invoice = await Invoice.updateOne(
      { businessId },
      {
        $push: {
          invoice: {
            cashier,
            customer,
            total,
            items: storage,
          },
        },
      }
    );

    storage.map(async (befItem) => {
      await Product.updateOne(
        { businessId, "product._id": befItem._id },
        {
          $set: {
            "product.$.qty": befItem.newStock,
          },
        }
      );
    });

    res.status(200).json({
      msg: "Invoice is successfully created",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
