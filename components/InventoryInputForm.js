import { useState } from "react";
const ObjectId = require("mongodb").ObjectID;

const InventoryInput = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState();
  const [desc, setDesc] = useState();
  const [image, setImage] = useState();
  const [capital, setCapital] = useState();

  const handleAdd = () => {
    const newItem = {
      name,
      desc,
      image,
      capital,
      active: true,
      _id: new ObjectId(),
    };
    data.push(newItem);

    setName("");
    setDesc("");
    setImage("");
    setCapital("");
  };

  return (
    <div>
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
        <input
          type="textarea"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <br />

        <label>Capital</label>
        <input
          type="text"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          required
        />
        <br />

        <label>Image</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <br />

        <button onClick={handleAdd}>Add</button>
      </div>
      <form action="">
        <ul>
          {data.map((item) => {
            return (
              <li key={item._id}>
                <img src={item.image} alt="" />

                <p>{item.name}</p>

                <p>{item.desc}</p>

                <p>Capital: </p>
                <p>{item.capital}</p>
              </li>
            );
          })}
        </ul>
      </form>
    </div>
  );
};

export default InventoryInput;
