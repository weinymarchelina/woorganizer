import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

const Login = () => {
  const [session, loadingSession] = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");
  }

  return (
    <div className="body">
      {loadingSession && <p>Loading...</p>}

      {!session && (
        <div className="Auth center">
          <div className="center-column">
            <h1>Let's get Started.</h1>
            <img src="/undraw_digital_nomad_re_w8uy.svg" alt="" />
          </div>
          <div className="pad">
            <h2>
              Ready to have an organized business?
              <br />
              Click the button below to sign in.
            </h2>
            <br />
            <button
              onClick={() =>
                signIn(null, {
                  callbackUrl: `${window.location.origin}/`,
                })
              }
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
