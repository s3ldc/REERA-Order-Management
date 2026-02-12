import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const users = useQuery(api.users.getUsers);

  if (users === undefined) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Users</h1>
      {users.map((user) => (
        <div key={user._id}>
          {user.name} - {user.role}
        </div>
      ))}
    </div>
  );
}