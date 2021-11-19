import { signIn, useSession } from "next-auth/client";
import { useRole } from "../../Contexts/RoleContext";
import { useRouter } from "next/router";
import Link from "next/link";

const Login = () => {
  const [session, loadingSession] = useSession();
  const router = useRouter();

  if (session) {
    router.push("/main");
  }

  return (
    <div>
      {loadingSession && <p>Loading...</p>}

      {!session && (
        <>
          <p>Let's get Started.</p>
          <button
            onClick={() =>
              signIn(null, {
                callbackUrl: `${window.location.origin}/main`,
              })
            }
          >
            Sign In
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
