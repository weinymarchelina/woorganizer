import { getSession } from "next-auth/client";
import useCheck from "../../../hooks/useProduct";
import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";

const AddInvoice = ({ session }) => {
  const {
    isLoading,
    space,
    storage,
    setStorage,
    businessId,
    display,
    setDisplay,
  } = useCheck();
  const router = useRouter();

  if (!isLoading && !businessId && process.browser) {
    router.push("/");
  }

  const cashierName = session.user.name;
  const [total, setTotal] = useState(0);
  const [customer, setCustomer] = useState("");
  const [tab, setTab] = useState(false);
  const [needed, setNeeded] = useState("1");

  const handleDelete = (select) => {
    const saved = storage.filter((item) => item._id !== select._id);
    const [selectedItem] = space.filter((item) => item._id === select._id);

    display.push(selectedItem);
    setStorage(saved);

    const price = parseFloat(total);
    setTotal(price - parseFloat(select.price));
  };

  const addProduct = (select) => {
    let checkedNeeded = Math.abs(parseFloat(needed));
    if (!checkedNeeded) {
      checkedNeeded = 1;
    }

    if (checkedNeeded > select.qty) {
      checkedNeeded = select.qty;
    }

    const wholePrice = parseFloat(select.price) * parseFloat(checkedNeeded);

    const result = parseFloat(select.qty) - parseFloat(checkedNeeded);

    const selectedItem = {
      name: select.name,
      price: wholePrice,
      _id: select._id,
      needed: checkedNeeded,
      newStock: result,
    };

    storage.push(selectedItem);
    setNeeded("1");

    const price = parseFloat(total);
    setTotal(wholePrice + price);

    const newDisplay = display.filter((item) => item._id !== select._id);
    setDisplay(newDisplay);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const obj = {
      cashier: cashierName,
      total,
      customer,
      storage,
      businessId,
    };

    try {
      const res = await axios.post("/api/invoice/add", obj);
      console.log(res.data.msg);
      console.log(res.data.product);

      setStorage([]);

      router.push("/main/invoice");
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div className="addItem">
      {isLoading && <p>Loading...</p>}
      {!isLoading && businessId && (
        <div>
          <h1>Create Invoice</h1>
          <button onClick={() => (tab ? setTab(false) : setTab(true))}>
            Select Product
          </button>

          {tab && (
            <div>
              <h2>Product List</h2>
              {!isLoading &&
                display.map((item) => {
                  return (
                    <li key={item._id}>
                      <p>{item.name}</p>
                      <p>Price: {item.price}</p>
                      <p>{item.desc}</p>
                      <p>Stock: {item.qty}</p>

                      <label>Needed: </label>
                      <input
                        type="number"
                        value={needed}
                        min="1"
                        onChange={(e) => setNeeded(e.target.value)}
                      />
                      <button onClick={() => addProduct(item)}>
                        Add Product
                      </button>
                    </li>
                  );
                })}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h1>Invoice Display</h1>

            <p>Total: {total} </p>

            <p>Customer Name</p>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder={"Optional"}
            />
            <br />

            <p>Cashier Name: {cashierName}</p>
            <br />

            <ul>
              <h2>Current List</h2>
              <br />
              <button type="submit">Add invoice</button>

              {storage.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>

                    <p>{item.desc}</p>

                    <p>Price: {item.price}</p>
                    <p>Stock: {item.needed}</p>

                    <button onClick={() => handleDelete(item)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddInvoice;

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
