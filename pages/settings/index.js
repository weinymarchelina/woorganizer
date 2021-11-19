import { signOut, getSession } from "next-auth/client";
import useCheck from "../../customHooks/useCheck";
import React, { useState } from "react";
import Link from "next/link";

export default function Settings({ session }) {
  const { user } = session;
  const { business, role, setRole } = useCheck();
  const [hide, setHide] = useState(false);

  console.log(user);

  return (
    <div>
      <h1>Settings</h1>

      {business && (
        <div>
          <label>Name</label>
          <p>{user.name}</p>

          <br />

          <label>Email</label>
          <p>{user.email}</p>

          <br />

          <label>Business</label>
          <p>{business.name}</p>

          <br />

          <label>Role</label>
          <p>{hide ? "Owner" : role}</p>

          <br />

          <button>
            <Link href="/settings/business">Business Profile</Link>
          </button>

          <button
            onClick={() => {
              if (role === "Owner") {
                setHide(true);
              }
              setRole("Employee");
              signOut({ callbackUrl: `${window.location.origin}/` });
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {!business && (
        <div>
          <label>Name</label>
          <p>{user.name}</p>

          <br />

          <label>Email</label>
          <p>{user.email}</p>

          <br />

          <button
            onClick={() => {
              signOut({ callbackUrl: `${window.location.origin}/` });
            }}
          >
            Sign Out
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
    props: { session },
  };
}
