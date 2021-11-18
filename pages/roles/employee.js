import { getSession } from "next-auth/client";
import { useRouter } from "next/router";

import { useBusiness } from "../../Contexts/RoleContext";
import React, { useState } from "react";
import axios from "axios";
import useCheck from "../../customHooks/useCheck";

const Employee = () => {
  const { business, isLoading } = useCheck();
  const router = useRouter();

  if (business) {
    router.push("/main");
  }

  //===================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [business, setBusiness] = useBusiness();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/business/check", {
        email,
        password,
      });
      console.log(res.data.msg);

      // const { businessData } = res.data;
      // setBusiness(businessData);

      setEmail("");
      setPassword("");

      router.push("/main");
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div>
      {isLoading && (
        <div>
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && !business && (
        <div>
          <h1>Join to your business' account</h1>

          <form onSubmit={handleSubmit}>
            <label>Business' Email</label>
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

            <button type="submit">Join</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Employee;

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
