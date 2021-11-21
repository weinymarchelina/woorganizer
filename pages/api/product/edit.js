import dbConnect from "../../../db/database";
import Product from "../../../models/product";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import Inventory from "../../../models/inventory";

dbConnect();

export default handler.post(async (req, res) => {
  await updateItems(req, res);
});

const updateItems = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { businessId, productStock, productId, necessary } = req.body;

    await Product.updateOne(
      { businessId, "product._id": productId },
      {
        $set: {
          "product.$.qty": productStock,
        },
      }
    );

    necessary.map(async (befItem) => {
      await Inventory.updateOne(
        { businessId, "inventory._id": befItem.materialId },
        {
          $set: {
            "inventory.$.qty": befItem.currentStock,
          },
        }
      );
    });

    return res.status(200).json({
      msg: "Product succesfully updated",
    });

    // const [theSelectedProduct] = products.filter((item) => {
    //   return item._id == productId
    // })
    // console.log(theSelectedProduct)

    // theSelectedProduct.qty = productStock

    // await Inventory.findOne({ businessId }).then((result) => {
    //   console.log(result.inventory);
    //   const inventory = result.inventory;

    //   const done = inventory.map((material) => {
    //     const [selected] = necessary.filter((befItem) => {
    //        if(befItem.materialId == material._id) {
    //          material.qty = befItem.currentStock
    //        }
    //     })
    //   })
    //   });
  } catch (err) {
    console.log("Alert!");
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
