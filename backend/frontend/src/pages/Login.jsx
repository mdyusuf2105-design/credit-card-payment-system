import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      navigate("/dashboard");
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
        {darkMode ? "Light" : "Dark"}
      </button>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Login to your account
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

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* REGISTER */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;