import { getSession } from "next-auth/client";
import useCheck from "../../../hooks/useInventory";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

const AddProduct = (session) => {
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

  // if (!isLoading && !business && process.browser) {
  //   router.push("/");
  // }

  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState();
  const [capital, setCapital] = useState(0);
  const [qty, setQty] = useState();
  const [usedMaterial, setUsedMaterial] = useState([]);

  const [tab, setTab] = useState(false);
  const [needed, setNeeded] = useState("1");
  const [placeholder, setPlaceholder] = useState(
    `It should be more than ${capital}`
  );

  const customId = (name) => {
    return `${new Date()}${name}${Math.random() * 999}`;
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const newItem = {
      name,
      desc,
      image,
      price,
      capital,
      qty,
      active: true,
      material: usedMaterial,
      _id: customId(name),
    };
    storage.push(newItem);

    setName("");
    setDesc("");
    setImage(null);
    setPrice("");
    setCapital(0);
    setQty("");
    setPlaceholder(`It should be more than 0`);
    setUsedMaterial([]);
    setDisplay(space);
  };

  const handleDelete = (id) => {
    const saved = storage.filter((item) => item._id !== id);
    setStorage(saved);
    setPlaceholder(`It should be more than ${capital}`);
  };

  const addMaterial = (select) => {
    console.log(`You have selected ${select.name}`);

    const [theItem] = display.filter((item) => item._id === select._id);

    console.log("check for trickster");
    console.log(needed);
    let checkedNeeded = Math.abs(parseFloat(needed));
    if (!checkedNeeded) {
      checkedNeeded = 1;
      console.log(`the needed currently: ${needed}`);
    }
    console.log(`the needed now: ${needed}`);

    const wholeCapital =
      parseFloat(theItem.capital) * parseFloat(checkedNeeded);

    const selectedItem = {
      name: theItem.name,
      capital: wholeCapital,
      _id: theItem._id,
      needed: checkedNeeded,
    };

    setNeeded(checkedNeeded);

    const displayedNow = display.filter((item) => item._id !== select._id);
    setDisplay(displayedNow);

    console.log("This is the item that u selected");
    console.log(selectedItem);
    usedMaterial.push(selectedItem);

    console.log("This is displayed now");
    console.log(displayedNow);

    console.log("You used: ");
    console.log(usedMaterial);
    setNeeded("1");

    const cost = selectedItem.capital;
    const currentCapital = capital;
    const result = parseFloat(currentCapital) + parseFloat(cost);
    setCapital(result);
    setPlaceholder(`It should be more than ${result}`);
  };

  const deleteMaterial = (select) => {
    const otherMaterial = usedMaterial.filter(
      (item) => item._id !== select._id
    );
    const [selectedItem] = space.filter((item) => item._id === select._id);

    console.log(otherMaterial);
    console.log(selectedItem);

    setUsedMaterial(otherMaterial);
    display.push(selectedItem);

    console.log("This is displayed now");
    console.log(display);

    console.log("You used: ");
    console.log(usedMaterial);

    const cost = parseFloat(selectedItem.capital);
    const currentCapital = capital;
    const result = parseFloat(currentCapital) - parseFloat(cost);
    setCapital(result);
    setPlaceholder(`It should be more than ${result}`);
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
      {!isLoading && (
        <div>
          <h1>Add Product</h1>

          <form onSubmit={handleAdd}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />

            <label>Description</label>
            <textarea
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <br />

            <p>Capital: {capital}</p>
            <br />

            <label>Price</label>
            <input
              type="number"
              value={price}
              placeholder={placeholder}
              min={capital}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <br />

            <label>Quantity</label>
            <input
              type="number"
              value={qty}
              min={1}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <br />

            {/* <label>Image</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <br /> */}

            <label>Materials</label>
            <ul>
              {usedMaterial.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.needed}</p>
                    <p>Capital: {item.capital}</p>

                    <button onClick={() => deleteMaterial(item)}>X</button>
                  </li>
                );
              })}
            </ul>

            <button onClick={() => (tab ? setTab(false) : setTab(true))}>
              Select Material from Inventory
            </button>
            <button type="submit">Add Item</button>
          </form>
          {tab && (
            <div>
              <h2>Material List</h2>
              {display.map((item) => {
                return (
                  <li key={item._id}>
                    <p>{item.name}</p>
                    <p>{item.desc}</p>
                    <p>Capital: {item.capital}</p>
                    {/* <p>Stock: {item.qty}</p> */}
                    <label>Needed: </label>
                    <input
                      type="number"
                      value={needed}
                      min="1"
                      placeholder={"By default is 1"}
                      onChange={(e) => setNeeded(e.target.value)}
                    />
                    <button onClick={() => addMaterial(item)}>
                      Add Material
                    </button>
                  </li>
                );
              })}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <ul>
              <h2>
                Current List <button type="submit">Add list to product</button>
              </h2>

              {storage.map((item) => {
                return (
                  <li key={item._id}>
                    <img src={item.image} alt="" />

                    <p>{item.name}</p>

                    <p>{item.desc}</p>

                    <p>Price: {item.price}</p>
                    <p>Capital: {item.capital}</p>
                    <p>Stock: {item.qty}</p>
                    <ul>
                      The materials:
                      {item.material.map((thing) => {
                        return (
                          <li key={thing._id}>
                            {thing.needed} {thing.name}
                          </li>
                        );
                      })}
                    </ul>

                    <button onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          </form>
        </div>
      )}
    </>
  );
};

export default AddProduct;

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
