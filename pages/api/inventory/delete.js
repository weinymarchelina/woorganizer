import dbConnect from "../../../db/database";
import Inventory from "../../../models/inventory";
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

    const products = await Product.findOne({
      businessId,
    });

    let useMaterial = null;
    let productName = null;

    const filter = products.product.filter((item) => {
      const result = item.material.filter((thing) => {
        return thing._id === itemId;
      });

      if (result[0]) {
        console.log(`${result[0].name} is used in ${item.name}!`);
        productName = item.name;
        useMaterial = true;
      } else {
        console.log(`Safe to delete`);
        useMaterial = false;
      }
    });

    console.log(`Is this material is used? ${useMaterial}`);

    if (useMaterial) {
      return res.status(403).json({
        msg: `This material is used in ${productName}, therefore cannot delete material before deleting ${productName}.`,
      });
    }

    await Inventory.updateOne(
      { businessId },
      {
        $pull: {
          inventory: {
            _id: itemId,
          },
        },
      },
      {
        multi: true,
      }
    );

    const result = await Inventory.findOne({
      businessId,
    });

    res.status(200).json({
      result,
      msg: "Material is successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
