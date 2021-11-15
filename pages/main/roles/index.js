import { getSession } from "next-auth/client";
import Link from "next/link";

export default function Roles({ user }) {
  return (
    <div>
      <h1>Decide your Roles</h1>
      <p>
        Welcome <b>{user.name}</b>, let's set your roles!
      </p>
      <p>Are you a business owner or an employee?</p>
      <button>
        <Link href="/main/roles/owner">I'm a business owner</Link>
      </button>
      <button>
        <Link href="/main/roles/employee">I'm an employee</Link>
      </button>
    </div>
  );
}

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
    props: { user: session.user },
  };
}
