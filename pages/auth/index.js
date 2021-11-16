import Head from "next/head";
import {
  getSession,
  providers,
  signIn,
  signOut,
  useSession,
} from "next-auth/client";
import { RoleContext } from "../../Contexts/RoleContext";
import { useContext } from "react";

const Login = () => {
  const [session, loadingSession] = useSession();
  const [role, setRole] = useContext(RoleContext);

  console.log(`The role: ${role}`);

  if (loadingSession) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Head>
        <title>NextAuth Google Authentication</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Google Authentication with NextAuth </h1>

      {!session && (
        <>
          <p>No role yet: {role}</p>
          <button onClick={() => signIn()}>Sign In</button>
        </>
      )}

      {session && (
        <>
          <h4>You are logged as: {session.user.name}</h4>
          <div>
            <h4>Email: {session.user.email}</h4>
            <p>Role: {role}</p>
            <br />
            {session.user.image && (
              <span>
                <img src={session.user.image} alt={session.user.name} />
              </span>
            )}
          </div>
          <br />
          <br />
          <button
            onClick={() => {
              setRole("employee");
              signOut();
            }}
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
};

// Login.getInitialsProps = async (context) => {
//   return {
//     providers: await providers(context),
//     session: await getSession(context),
//   };
// };

export default Login;
