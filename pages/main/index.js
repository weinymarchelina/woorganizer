import { getSession } from "next-auth/client";
import Link from "next/link";
import MsgBox from "../../components/MsgBox";
import useCheck from "../../customHooks/useCheck";

export default function Main({ user }) {
  const { business, isLoading } = useCheck();

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      <MsgBox />

      {!isLoading && business && (
        <div>
          <h1>Dashboard</h1>
          <p>Hi {user.name}, what would you like to do today?</p>
        </div>
      )}

      {!isLoading && !business && (
        <div>
          <h1>Getting Started</h1>
          <p>Hi, {user.name}, let's get you started!</p>
          <button>
            <Link href="/roles">Set your roles here!</Link>
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
