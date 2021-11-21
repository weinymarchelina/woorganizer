import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "../../../context/Context";
import axios from "axios";

const Product = (session) => {
  const [role, setRole] = useRole();
  const [business, setBusiness] = useState();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(false);
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState();
  const [materialData, setMaterialData] = useState([]);
  const [warning, setWarning] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  let allowed = false;

  const getItems = async () => {
    try {
      const res = await axios.get("/api/product");
      const { items, businessId, materialsDone } = await res.data;
      console.log(res.data);

      setBusiness(businessId);
      setInventory(items);
      setMaterialData(materialsDone);
      setLoading(false);

      allowed = true;
    } catch (err) {
      console.log(err.response.data);
      throw new Error(err);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const router = useRouter();

  if (!loading && !business && !allowed && process.browser) {
    if (business) {
      return;
    } else {
      router.push("/");
    }
  }

  const getStock = (id) => {
    const [material] = materialData.filter((item) => item.materialId == id);
    return material.materialStock;
  };

  const handleDelete = async (id) => {
    const businessId = business;

    setLoading(true);

    try {
      const res = await axios.post("/api/product/delete", {
        businessId,
        itemId: id,
      });
      const { products } = await res.data;
      console.log(res.data);

      setInventory(products.product);
    } catch (err) {
      console.log(err.response.data);
      throw new Error(err);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    checkCondition();
    console.log(canSubmit);

    if (!canSubmit) {
      setLoading(false);
      return;
    }

    try {
      console.log("here");
      const res = await axios.post("/api/product/edit", {
        businessId: business,
        productStock: qty,
        productId: selected._id,
        necessary: warning,
      });
      console.log(res);

      if (res) {
        console.log(res);
        setWarning(false);
        window.location.reload();
      }
    } catch (err) {
      console.log("The error: ");
      console.log(err);
      // console.log(err.response.data);
      // throw new Error(err.response?.data);
    }

    window.location.reload();
    setLoading(false);
  };

  const checkCondition = () => {
    console.log(`You want to have ${qty} product`);

    const msgs = selected.material.map((thing) => {
      thing.currentQty = getStock(thing._id);

      const totalNeeded = parseFloat(thing.needed) * parseFloat(qty);
      const currentStock =
        parseFloat(thing.currentQty) - parseFloat(totalNeeded);

      console.log(`
          You need ${thing.needed} ${thing.name}, and the current stock is ${thing.currentQty}.

          In total, you need ${totalNeeded} ${thing.name} in order to make ${qty} product.
          `);

      if (totalNeeded > thing.currentQty) {
        setCanSubmit(false);
        console.log("Stop, you have an issue");

        const theMsg = `Your ${
          thing.name
        } is not enough to make ${qty} product. You need ${Math.abs(
          currentStock
        )} more ${
          thing.name
        } in order to fullfil your wish. Please add more stock.`;
        return {
          theMsg,
          currentStock: undefined,
          materialId: thing._id,
        };
      } else {
        setCanSubmit(true);
        console.log("Free to go");

        const theMsg = `You can make ${qty} product by using ${totalNeeded} ${thing.name}. After submitting, the stock of ${thing.name} will be ${currentStock}.
        `;
        return {
          theMsg,
          currentStock,
          materialId: thing._id,
        };
      }
    });

    setWarning(msgs);
    console.log(msgs);
  };

  return (
    <div className="addItem">
      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          <h1>Product</h1>
          <h2>Item List</h2>
          <button>
            <Link href="/main/product/add">Create Product</Link>
          </button>
          <button>
            <Link href="/main/product/import">
              Import Product from Inventory
            </Link>
          </button>

          {tab && (
            <form onSubmit={handleSubmit}>
              <h2>Decide your stock</h2>

              <p>Name: {selected?.name}</p>
              <ul>
                {selected.material.map((thing) => {
                  return (
                    <li key={thing._id}>
                      {thing.needed} {thing.name}
                      <p>Current stock: {getStock(thing._id)}</p>
                    </li>
                  );
                })}
              </ul>
              {warning && (
                <div>
                  {warning.map((obj) => {
                    return <p>{obj.theMsg}</p>;
                  })}
                </div>
              )}
              <br />
              <label>Quantity</label>
              <br />
              <br />
              <input
                type="number"
                value={qty}
                min={0}
                onChange={(e) => setQty(e.target.value)}
                required
              />
              <br />
              <br />
              <br />

              <button type="submit">Submit</button>

              <button
                onClick={() => {
                  setTab(false);
                  setWarning([]);
                }}
              >
                Cancel
              </button>
            </form>
          )}

          {!loading && inventory && (
            <>
              {inventory.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.desc}</p>
                    <p>Price: {item.price}</p>
                    <p>Capital: {item.capital}</p>
                    <p>
                      Stock: {item.qty == undefined ? "" : item.qty}
                      {!tab && !item.qty && (
                        <button
                          onClick={() => {
                            setTab(true);
                            setSelected(item);
                          }}
                        >
                          Set stock
                        </button>
                      )}
                    </p>
                    <ul>
                      <p>Materials </p>
                      {item.material.map((thing) => {
                        return (
                          <li key={thing._id}>
                            {thing.needed} {thing.name}
                          </li>
                        );
                      })}
                    </ul>
                    {!tab && !item.qty && (
                      <button onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    )}
                  </li>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Product;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
