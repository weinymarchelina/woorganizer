import { signIn, useSession } from "next-auth/client";
import { useRole } from "../../Contexts/RoleContext";
import Link from "next/link";

const Login = () => {
  const [session, loadingSession] = useSession();

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

      {session && (
        <>
          <h4>You are logged as: {session.user.name}</h4>
          <div>
            <h4>Email: {session.user.email}</h4>
            <p>Role: {role}</p>
            <br />
            {session.user.image && (
              <span>
                <img src={session.user.image} alt={session.user.name} />
              </span>
            )}
          </div>
          <br />
          <br />
          <button>
            <Link href="/main">Go to Dashboard</Link>
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
