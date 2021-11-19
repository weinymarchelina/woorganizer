import { getSession } from "next-auth/client";
import useCheck from "../../../customHooks/useCheck";
import { useRouter } from "next/router";
import Link from "next/link";

const Inventory = (session) => {
  const { isLoading, role, business, setBusiness } = useCheck();
  const router = useRouter();

  if (!isLoading && !business && process.browser) {
    router.push("/");
  }

  return (
    <div>
      <h1>Inventory Control System</h1>

      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <div>
          <h2>Item List</h2>
        </div>
      )}

      <button>
        <Link href="/main/inventory/add">Add</Link>
      </button>
    </div>
  );
};

export default Inventory;

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
