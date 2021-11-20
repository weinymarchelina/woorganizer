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

  const getItems = async () => {
    const res = await axios.get("/api/product");
    const { items, businessId } = await res.data;
    console.log(res.data);

    setBusiness(businessId);
    setInventory(items);
    setLoading(false);
    console.log(inventory);
  };

  useEffect(() => {
    getItems();
  }, []);

  const router = useRouter();

  if (!loading && !business && process.browser) {
    if (business) {
      return;
    } else {
      router.push("/");
    }
  }

  const handleDelete = () => {
    //
  };

  return (
    <div>
      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          <h1>Product</h1>
          <h2>
            Item List
            <button>
              <Link href="/main/product/add">Create Product</Link>
            </button>
            <button>
              <Link href="/main/product/import">
                Import Product from Inventory
              </Link>
            </button>
          </h2>

          {inventory && (
            <>
              {inventory.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.desc}</p>
                    <p>Price: {item.price}</p>
                    <p>Capital: {item.capital}</p>
                    <p>Stock: {item.qty}</p>
                    <ul>
                      <p>Materials: </p>
                      {item.material.map((thing) => {
                        return (
                          <li key={thing._id}>
                            {thing.needed} {thing.name}
                          </li>
                        );
                      })}
                    </ul>
                    <button onClick={handleDelete}>Delete</button>
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
