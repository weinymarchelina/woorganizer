import React, { useState } from "react";
import { getSession } from "next-auth/client";
import axios from "axios";

const Owner = (session) => {
  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(session);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/business", {
        name,
        field,
        phone,
        email,
        password,
      });
      console.log(res.data.msg);

      setName("");
      setField("");
      setPhone("");
      setEmail("");
      setPassword("");
    } catch (err) {
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div>
      <main>
        <h2>Business Form</h2>

        <form onSubmit={handleSubmit}>
          <label>Business' Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <label>Field</label>
          <input
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            required
          />
          <br />
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <br />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <br />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Create</button>
        </form>
      </main>
    </div>
  );
};

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

  // if (role) {
  //   return {
  //     redirect: {
  //       destination: "/main/home",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
}

export default Owner;
