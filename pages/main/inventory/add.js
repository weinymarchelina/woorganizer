import { getSession } from "next-auth/client";
import useCheck from "../../../customHooks/useCheck";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
const customId = require("custom-id");

const AddThings = (session) => {
  const { isLoading, role, business, storage, setStorage } = useCheck();
  const router = useRouter();

  if (!isLoading && !business && process.browser) {
    router.push("/");
  }

  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState(null);
  const [capital, setCapital] = useState();
  const [qty, setQty] = useState();

  let id = customId({
    randomLength: 6,
  });

  const handleAdd = () => {
    const newItem = {
      name,
      desc,
      image,
      capital,
      qty,
      active: true,
      _id: id,
    };
    storage.push(newItem);

    setName("");
    setDesc("");
    setImage(null);
    setCapital("");
    setQty("");
  };

  const handleDelete = (id) => {
    const saved = storage.filter((item) => item._id !== id);
    setStorage(saved);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(storage);
    console.log({ ...storage });

    const items = await storage.map((item) => {
      const { name, desc, image, capital, qty, active } = item;
      const newItem = {
        name,
        desc,
        image,
        capital,
        qty,
        active,
      };
      return newItem;
    });
    console.log(items);

    const obj = {
      items,
      businessId: business._id,
    };

    try {
      const res = await axios.post("/api/inventory", obj);
      console.log(res.data.msg);
      console.log(res.data.inventory);

      setStorage([]);

      router.push("/main/inventory");
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div>
      <h1>AddThings</h1>

      <div>
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

        <label>Capital</label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          required
        />
        <br />

        <label>Quantity</label>
        <input
          type="number"
          value={qty}
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

        <button onClick={handleAdd}>Add</button>
      </div>
      <form onSubmit={handleSubmit}>
        <ul>
          <h2>
            Current List <button type="submit">Add list to inventory</button>
          </h2>

          {storage.map((item) => {
            return (
              <li key={item._id}>
                <img src={item.image} alt="" />

                <p>{item.name}</p>

                <p>{item.desc}</p>

                <p>Capital: {item.capital}</p>
                <p>Stock: {item.qty}</p>

                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </form>
    </div>
  );
};

export default AddThings;

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
