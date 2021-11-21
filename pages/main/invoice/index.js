import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRole } from "../../../context/Context";
import axios from "axios";

const Invoice = (session) => {
  const [role, setRole] = useRole();
  const [business, setBusiness] = useState();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  let allowed = false;

  const getItems = async () => {
    const res = await axios.get("/api/invoice");
    const { invoices, businessId } = await res.data;

    setBusiness(businessId);
    setInventory(invoices);
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

  return (
    <div className="addItem">
      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          <h1>Invoice Control System</h1>
          <h2>Invoice List</h2>
          <button>
            <Link href="/main/invoice/add">Add</Link>
          </button>

          {inventory && (
            <>
              {inventory.map((invoice) => {
                return (
                  <li key={invoice._id}>
                    <p>Total: {invoice.total}</p>
                    <p>Cashier: {invoice.cashier}</p>
                    <p>Customer: {invoice.customer}</p>
                    {invoice.items.map((item) => {
                      return (
                        <li key={item._id}>
                          {item.needed} {item.name}
                          <p>Price: {item.price}</p>
                        </li>
                      );
                    })}
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

export default Invoice;

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
