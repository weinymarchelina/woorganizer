import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import useCheck from "../../hooks/useCheck";
import axios from "axios";
import { useState } from "react";

const BusinessProfile = ({ session }) => {
  const { userId } = session;
  const { business, role, isLoading } = useCheck();
  const [password, setPassword] = useState("");
  const [wantKick, setWantKick] = useState(null);
  const router = useRouter();

  if (!isLoading && !business) {
    router.push("/");
  }

  const handleKick = async () => {
    try {
      const res = await axios.post("/api/business/kick", {
        ownerId: userId,
        ownerPass: password,
        businessName: business.name,
        businessId: business._id,
        employeeId: wantKick.userId,
      });
      console.log(res.data.msg);
      console.log(`You have kicked ${wantKick.name}`);
    } catch (err) {
      console.log(err);
      throw new Error(err.response.data.msg);
    }
  };

  return (
    <div className="body">
      {isLoading && <p>Loading...</p>}
      {!isLoading && business && (
        <div className="middle">
          <h1>Your Business</h1>

          <br />

          <p>Name</p>
          <p>{business.name}</p>
          <br />

          <p>Field</p>
          <p>{business.field}</p>
          <br />

          <p>Phone Number</p>
          <p>{business.phone}</p>
          <br />

          <p>Email</p>
          <p>{business.email}</p>
          <br />

          <p>Team</p>
          <ul>
            {business.team.map((member) => {
              return (
                <li key={member.userId}>
                  <p>
                    {member.name}: {member.role}
                  </p>
                  {role === "Owner" && member.role === "Employee" && (
                    <button onClick={() => setWantKick(member)}>
                      Kick Employee
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {wantKick && (
            <div>
              <p>Please input your password to kick {wantKick.name}</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button onClick={handleKick}>Kick</button>
              <button onClick={() => setWantKick(null)}>Cancel</button>
            </div>
          )}

          <br />
        </div>
      )}
    </div>
  );
};

export default BusinessProfile;

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
