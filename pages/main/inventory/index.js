import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "../../../context/Context";
import axios from "axios";

const Inventory = (session) => {
  const [role, setRole] = useRole();
  const [business, setBusiness] = useState();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState("");
  let allowed = false;

  const getItems = async () => {
    const res = await axios.get("/api/inventory");
    const { items, businessId } = await res.data;

    setBusiness(businessId);
    setInventory(items);
    setLoading(false);
    allowed = true;
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

  const handleDelete = async (id) => {
    console.log(business);
    console.log(id);

    const businessId = business;
    console.log(businessId);

    setLoading(true);

    try {
      const res = await axios.post("/api/inventory/delete", {
        businessId,
        itemId: id,
      });
      const { result, msg } = await res.data;
      setInventory(result.inventory);
      setWarning(msg);
    } catch (err) {
      console.log(err.response.data.msg);
      setWarning(err.response.data.msg);

      // throw new Error(err.response.data.msg);
    }

    setLoading(false);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="addItem">
          <h1>Inventory Control System</h1>
          <h2>Item List</h2>
          <button>
            <Link href="/main/inventory/add">Add</Link>
          </button>

          {warning && (
            <div>
              <p>{warning}</p>
              <button onClick={() => setWarning(false)}>Okay!</button>
            </div>
          )}
          {inventory && (
            <>
              {inventory.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.desc}</p>
                    <p>Capital: {item.capital}</p>
                    <p>Stock: {item.qty}</p>
                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
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

export default Inventory;

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
