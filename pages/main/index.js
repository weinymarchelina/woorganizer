import { getSession } from "next-auth/client";
import Link from "next/link";

export default function Main({ user }) {
  return (
    <div>
      <h1>Dashboard(Protected Route)</h1>
      <p>
        Welcome to dashboard: <b>{user.name}</b>
      </p>
      <p>{user.email}</p>

      <button>
        <Link href="/main/roles">Let's set your roles here!</Link>
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log(session);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  // if (!session.user.role) {
  //   console.log("No role yet, redirecting you to roles");
  //   return {
  //     redirect: {
  //       destination: "/main/roles",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { user: session.user },
  };
}
