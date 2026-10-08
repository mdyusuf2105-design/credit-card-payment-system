import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            password2,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.email?.[0] ||
            data.username?.[0] ||
            data.password?.[0] ||
            "Registration failed."
        );
      }

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10 text-gray-900 transition-colors duration-300 dark:bg-[#050505] dark:text-gray-100">

      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="absolute right-6 top-6 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-100 dark:border-[#333333] dark:bg-[#171717] dark:text-gray-200 dark:hover:bg-[#222222]"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>

      {/* REGISTER CARD */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Register for your account
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* USERNAME */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>

            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              required
            />
          </div>

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* LOGIN */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;