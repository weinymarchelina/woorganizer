import { getSession } from "next-auth/client";
import useCheck from "../../../hooks/useInventory";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const ImportProduct = (session) => {
  const {
    isLoading,
    space,
    storage,
    setStorage,
    display,
    setDisplay,
    businessId,
  } = useCheck();
  const router = useRouter();

  if (!isLoading && !businessId && process.browser) {
    router.push("/");
  }

  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState();
  const [capital, setCapital] = useState(0);
  // const [qty, setQty] = useState();
  const [itemId, setItemId] = useState(null);

  const [tab, setTab] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    `It should be more than ${capital}`
  );

  const handleAdd = (e) => {
    e.preventDefault();

    const newItem = {
      name,
      desc,
      image,
      price,
      capital,
      qty: undefined,
      active: true,
      material: [
        {
          name: name,
          capital: capital,
          needed: 1,
          _id: itemId,
        },
      ],
      _id: itemId,
    };
    storage.push(newItem);

    setName("");
    setDesc("");
    setImage(null);
    setPrice("");
    setCapital(0);
    // setQty("");
    setItemId("");
    setPlaceholder(`It should be more than 0`);
  };

  const handleDelete = (id) => {
    console.log("The selected id");
    console.log(id);

    const saved = storage.filter((item) => item._id !== id);
    setStorage(saved);
    console.log("Saved");
    console.log(saved);

    const [selectedItem] = space.filter((item) => item._id === id);

    console.log("Selected");
    console.log(selectedItem);

    display.push(selectedItem);
  };

  const addItem = (select) => {
    setItemId(select._id);
    setName(select.name);
    setDesc(select.desc);
    setImage(select.image);
    setCapital(select.capital);
    // setQty(select.qty);
    setPlaceholder(`It should be more than ${capital}`);
    setPrice(price);

    console.log(select._id);

    const displayedNow = display.filter((item) => item._id !== select._id);
    setDisplay(displayedNow);
    console.log(displayedNow);

    console.log(display);
    setPlaceholder(`It should be more than 0`);
  };

  const handleCancel = () => {
    setName("");
    setDesc("");
    setImage(null);
    setPrice("");
    setCapital(0);
    // setQty("");
    setPlaceholder(`It should be more than 0`);

    const [selectedItem] = space.filter((item) => item._id === itemId);
    display.push(selectedItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(storage);
    console.log({ ...storage });

    const items = await storage.map((item) => {
      const { name, desc, image, price, capital, qty, material, active } = item;

      const newItem = {
        name,
        desc,
        image,
        price,
        capital,
        qty,
        active,
        material,
      };
      return newItem;
    });
    console.log(items);

    const obj = {
      items,
      businessId,
    };

    try {
      const res = await axios.post("/api/product/add", obj);
      console.log(res.data.msg);
      console.log(res.data.product);

      setStorage([]);

      router.push("/main/product");
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {!isLoading && businessId && (
        <div className="addItem">
          <h1>Import Product</h1>

          <form onSubmit={handleAdd}>
            <p>Name</p>
            <p>{name}</p>
            <br />
            <p>Description</p>
            <p>{desc}</p>
            <br />
            <p>Capital</p>
            <p> {capital}</p>
            <br />
            <label>Price</label>
            <br />
            <input
              type="number"
              value={price}
              placeholder={placeholder}
              min={capital}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <br />
            <br />
            <br />
            <button onClick={() => (tab ? setTab(false) : setTab(true))}>
              Select Item from Inventory
            </button>
            {itemId && (
              <>
                <button type="submit">Add Item</button>
                <button onClick={handleCancel}>Cancel Item</button>
              </>
            )}
          </form>
          {tab && (
            <div>
              <h2>Item List</h2>
              {display.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.desc}</p>
                    <p>Capital: {item.capital}</p>
                    {/* <p>Stock: {item.qty}</p> */}
                    {!name && (
                      <button onClick={() => addItem(item)}>Add Item</button>
                    )}
                  </li>
                );
              })}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <ul>
              <h2>Current List</h2>

              {storage.map((item) => {
                return (
                  <li key={item._id}>
                    <img src={item.image} alt="" />

                    <p>{item.name}</p>

                    <p>{item.desc}</p>

                    <p>Price: {item.price}</p>
                    <p>Capital: {item.capital}</p>
                    {/* <p>Stock: {item.qty}</p> */}

                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </li>
                );
              })}

              <button type="submit">Add list to product</button>
              <br />
            </ul>
          </form>
        </div>
      )}
    </>
  );
};

export default ImportProduct;

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
