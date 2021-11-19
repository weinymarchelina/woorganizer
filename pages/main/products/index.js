import { getSession } from "next-auth/client";
import useCheck from "../../../customHooks/useCheck";

const Products = (session) => {
  const { isLoading, role, business, setBusiness } = useCheck();

  return (
    <div>
      <h1>Products</h1>
    </div>
  );
};

export default Products;

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
