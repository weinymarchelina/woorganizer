import { providers, signIn, getSession, csrfToken } from "next-auth/client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useAuth from "../../customHooks/useAuth";

function signin() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState("haha@haha.com");
  const [password, setPassword] = useState("1");

  const data = {
    name,
    email,
    password,
  };

  const { auth, setAuth } = useAuth(data);

  const router = useRouter();
  // let [click, setClick] = useState(false);
  // let click = null;

  const handleClick = () => {
    console.log("You have clicked");
    // setClick(true);

    // signIn("credentials", {
    //   name: null,
    //   email,
    //   password,
    // });

    // setAuth({
    //   name,
    //   email,
    //   password,
    // });

    // console.log(auth);
    setTimeout(() => {
      router.push("/login/checking");
    }, 10000);
  };

  return (
    <div>
      <div>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>

      <form>
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

        <button onClick={handleClick}>Login</button>
      </form>
    </div>
  );
}

export default signin;

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

// import { signIn, useSession } from "next-auth/client";
// import { useRole } from "../../Contexts/RoleContext";
// import Link from "next/link";

// const Login = () => {
//   const [session, loadingSession] = useSession();

//   if (session) {
//     router.push("/main");
//   }

//   return (
//     <div>
//       {loadingSession && <p>Loading...</p>}

//       {!session && (
//         <>
//           <p>Let's get Started.</p>
//           <button
//             onClick={() =>
//               signIn(null, {
//                 callbackUrl: `${window.location.origin}/main`,
//               })
//             }
//           >
//             Sign In
//           </button>
//         </>
//       )}

//       {session && (
//         <>
//           <h4>You are logged as: {session.user.name}</h4>
//           <div>
//             <h4>Email: {session.user.email}</h4>
//             <p>Role: {role}</p>
//             <br />
//             {session.user.image && (
//               <span>
//                 <img src={session.user.image} alt={session.user.name} />
//               </span>
//             )}
//           </div>
//           <br />
//           <br />
//           <button>
//             <Link href="/main">Go to Dashboard</Link>
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Login;
