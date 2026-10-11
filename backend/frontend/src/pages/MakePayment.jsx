
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPayment,
  processPayment,
  getProfile,
} from "../services/api";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  "Shopping",
  "Groceries",
  "Travel",
  "Food & Dining",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Entertainment",
  "Other",
];

function MakePayment() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Shopping");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const profile = await getProfile();

      const payment = await createPayment({
        user_id: profile.id,
        card_id: Number(cardId),
        amount: Number(amount),
        category,
      });

      const processedPayment = await processPayment(payment.id);

      alert(
        `Payment ${processedPayment.status}!\n` +
        `Payment ID: ${processedPayment.id}\n` +
        `Category: ${category}`
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-gray-100">
      <nav className="border-b border-gray-200 bg-white px-6 py-4 dark:border-[#292929] dark:bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <h1 className="text-xl font-bold">Credit Card Payment System</h1>
          <div className="flex gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-[#292929] dark:bg-[#151515]">
          <h2 className="mb-2 text-3xl font-bold">Make Payment</h2>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            Enter your payment details and choose a category.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Card ID
              </label>
              <input
                type="number"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="Enter saved card ID"
                min="1"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Transaction Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
                required
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Make Payment"}
            </button>
          </form>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold dark:border-[#333333]"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default MakePayment;
