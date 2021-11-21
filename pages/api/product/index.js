import dbConnect from "../../../db/database";
import Product from "../../../models/product";
import User from "../../../models/user";
import { getSession } from "next-auth/client";
import handler from "../../handler";
import Inventory from "../../../models/inventory";

dbConnect();

export default handler.get(async (req, res) => {
  await getItems(req, res);
});

const getItems = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ msg: "Invalid Authentication!" });
    }

    const { userId } = session;

    const user = await User.findOne({
      _id: userId,
    });

    if (!user.businessId) {
      return res.status(400).status(200).json({
        items: null,
        businessId: null,
        msg: "Please get into a business acc first",
      });
    }

    const businessId = user.businessId;

    const data = await Product.findOne({
      businessId,
    });

    const items = data.product;

    //================================

    // console.log(items);
    const materials = items.map((product) => product.material);
    // console.log(materials);
    const materialIds = materials.map((product) => {
      return product.map((thing) => thing._id);
    });
    // console.log(materialIds);
    const combinedIds = [...new Set(materialIds.flat(1))];
    // console.log(combinedIds);

    await Inventory.findOne({ businessId }).then((result) => {
      // console.log(result.inventory);
      const inventory = result.inventory;

      const materialsDone = combinedIds.map((id) => {
        // console.log(inventory)
        const [realItem] = inventory.filter((thing) => {
          // console.log(thing._id);
          const theId = thing._id;
          return theId == id;
        });

        return {
          materialId: id,
          materialStock: realItem.qty,
        };
      });

      return res.status(200).json({
        items,
        businessId,
        materialsDone,
        msg: "Product succesfully returned",
      });
    });
  } catch (err) {
    console.log("Alert!");
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
};
