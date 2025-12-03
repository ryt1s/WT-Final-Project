import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session)
    return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {session.user.email}</h1>
      <p className="mt-4 text-gray-600">You are logged in.</p>
    </div>
  );
}
