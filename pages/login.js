import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";

export default function Login({ csrfToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Invalid email or password");
    } else {
      window.location.href = "/dashboard"; // redirect after login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl p-8 rounded-lg max-w-sm w-full">

        <h1 className="text-2xl font-bold text-center mb-6">Professor Login</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <label className="block mb-2 font-semibold">Email:</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-2 font-semibold">Password:</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded mb-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

Login.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context),
  };
};
