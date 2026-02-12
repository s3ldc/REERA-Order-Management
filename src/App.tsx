import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const users = useQuery(api.users.getUsers);
  const createUser = useMutation(api.users.createUser);

  if (users === undefined) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>

      <button
        onClick={() =>
          createUser({
            name: "Sunil",
            email: "sunil@test.com",
            role: "Admin",
          })
        }
      >
        Add User
      </button>

      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}