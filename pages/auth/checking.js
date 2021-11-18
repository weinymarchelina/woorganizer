import useAuth from "../../customHooks/useAuth";
import React, { useState } from "react";
import { providers, signIn, getSession, csrfToken } from "next-auth/client";

const Checking = () => {
  const { auth, setAuth } = useAuth();

  console.log(auth);

  // const { name, email, password } = auth;

  let data = {};

  if (auth) {
    const { name, email, password } = auth;
    console.log({ name, email, password });
    data = { name, email, password };
  }

  const { name, email, password } = data;

  const [qname, setName] = useState(name);
  const [qemail, setEmail] = useState(email);
  const [qpassword, setPassword] = useState(password);

  signIn("credentials", data);

  return (
    <div>
      {auth && (
        <div>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
        </div>
      )}

      <form>
        <label>Email</label>
        <input
          type="email"
          value={qemail}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <label>Password</label>
        <input
          type="password"
          value={qpassword}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </form>
    </div>
  );
};

export default Checking;

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/main" },
    };
  }

  return {
    props: {
      providers: await providers(context),
      csrfToken: await csrfToken(context),
    },
  };
}
