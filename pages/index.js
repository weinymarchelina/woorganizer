import { getSession } from "next-auth/client";
import { useEffect } from "react";
import { useRole, useRoleUpdate } from "../Contexts/RoleContext";
import axios from "axios";

export default function Profile({ session }) {
  const [role, setRole] = useRole();

  const checkRole = async () => {
    const res = await axios.get("/api/role");
    const currentRole = res.data.currentRole;
    setRole(currentRole);
  };

  useEffect(() => {
    checkRole();
  }, []);

  return (
    <div>
      <p>{session.userId}</p>
      <p>Your role: {role}</p>
      {session && <p>You are authenciated</p>}
      {!session && <p>You are not authenciated</p>}
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
