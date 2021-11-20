import { getSession } from "next-auth/client";
import Link from "next/link";

export default function Profile({ session }) {
  return (
    <div>
      <h1>Woorganizer</h1>
      <p>Best business organizer tool.</p>

      {!session?.user && (
        <div>
          <button>
            <Link href="/auth">Login</Link>
          </button>
        </div>
      )}

      {session?.user && (
        <div>
          <button>
            <Link href="/main">Go to Dashboard</Link>
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
      props: { session: null },
    };
  }

  return {
    props: { session },
  };
}
