import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Link from "next/link";
import useCheck from "../../hooks/useCheck";

export default function Roles({ user }) {
  const { business, isLoading } = useCheck();
  const router = useRouter();

  if (business) {
    router.push("/");
  }

  return (
    <div className="body center roles">
      {isLoading && <p>Loading...</p>}
      {!isLoading && !business && (
        <div>
          <h1>Decide your Roles</h1>
          <p>{`Welcome <b>{user.name}</b>, let's set your roles!`}</p>
          <p>Are you a business owner or an employee?</p>
          <button>
            <Link href="/roles/owner">{`I'm a business owner`}</Link>
          </button>
          <button>
            <Link href="/roles/employee">{`I'm an employee`}</Link>
          </button>
        </div>
      )}
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
