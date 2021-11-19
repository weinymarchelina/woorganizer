import { getSession } from "next-auth/client";
import useCheck from "../../../customHooks/useCheck";
import { useRouter } from "next/router";

const Things = (session) => {
  const { isLoading, role, business, setBusiness } = useCheck();
  const router = useRouter();

  if (!business && process.browser) {
    router.push("/");
  }
  return (
    <div>
      <h1>Things</h1>
    </div>
  );
};

export default Things;

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
