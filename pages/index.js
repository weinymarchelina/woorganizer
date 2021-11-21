import { getSession } from "next-auth/client";
import Link from "next/link";
import useCheck from "../hooks/useCheck";

export default function Main({ user }) {
  const { business, isLoading } = useCheck();

  return (
    <div className="body index">
      {isLoading && <p>Loading...</p>}

      {!isLoading && business && (
        <div>
          <h1>Dashboard</h1>
          <p>Hi {user.name}, what would you like to do today?</p>
          <li>
            <Link href="/main/inventory">
              <a>Inventory</a>
            </Link>
          </li>
          <li>
            <Link href="/main/product">
              <a>Products</a>
            </Link>
          </li>
          <li>
            <Link href="/main/invoice">
              <a>Invoices</a>
            </Link>
          </li>
        </div>
      )}

      {!isLoading && !business && (
        <div className="Auth center">
          <div className="center-column">
            <h1>Getting Started</h1>
            <img src="/undraw_add_information_j2wg.svg" alt="" />
          </div>
          <div className="pad">
            <h2>Hi, {user.name}, let's get you started! </h2>
            <button>
              <Link href="/roles">Set your roles here!</Link>
            </button>
          </div>
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
