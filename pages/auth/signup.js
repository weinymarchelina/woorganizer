import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

const SignUp = () => {
  const [session, loadingSession] = useSession();
  const router = useRouter();

  if (session) {
    router.push("/main");
  }

  return (
    <div>
      <h1>Sign Up</h1>

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

export default SignUp;
