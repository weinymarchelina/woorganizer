import React, { useState } from "react";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import axios from "axios";
import useCheck from "../../hooks/useCheck";

const Owner = () => {
  const { business, isLoading } = useCheck();
  const router = useRouter();
  if (business) {
    router.push("/main");
  }

  const [name, setName] = useState("");
  const [field, setField] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/business", {
        name,
        field,
        phone,
        email,
        password,
      });

      setName("");
      setField("");
      setPhone("");
      setEmail("");
      setPassword("");

      router.push("/");
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div className="body  owner">
      {isLoading && <p>Loading...</p>}

      {!isLoading && !business && (
        <main>
          <h1>Business Form</h1>

          <form onSubmit={handleSubmit}>
            <label>{`Business's Name`}</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <br />
            <br />
            <label>Field</label>
            <br />
            <input
              type="text"
              value={field}
              onChange={(e) => setField(e.target.value)}
              required
            />

            <br />
            <br />
            <label>Phone Number</label>
            <br />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <br />
            <br />
            <label>Email</label>
            <br />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <br />
            <br />
            <label>Password</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <br />
            <br />

            <button type="submit">Create</button>
          </form>
        </main>
      )}
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

  return {
    props: { session },
  };
}

export default Owner;
