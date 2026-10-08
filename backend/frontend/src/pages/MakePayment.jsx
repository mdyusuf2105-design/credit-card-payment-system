import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment, processPayment, getProfile } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function MakePayment() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Step 1: Create payment with PENDING status
      const profile = await getProfile();

      const payment = await createPayment({
        user_id: profile.id,
        card_id: Number(cardId),
        amount: Number(amount),
      });

      // Step 2: Process the pending payment
      const processedPayment = await processPayment(payment.id);

      // Step 3: Show final result
      alert(
        `Payment ${processedPayment.status}!\nPayment ID: ${processedPayment.id}`
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#050505] dark:text-gray-100">

      {/* NAVBAR */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Credit Card Payment System
          </h1>

          <div className="flex items-center gap-3">

            {/* DARK / LIGHT MODE */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-200 dark:border-[#333333] dark:bg-[#171717] dark:text-gray-200 dark:hover:bg-[#222222]"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* DASHBOARD */}
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Dashboard
            </button>

          </div>
        </div>
      </nav>

      {/* PAYMENT FORM */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Make Payment
          </h1>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            Enter the payment details below.
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* CARD ID */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Card ID
              </label>

              <input
                type="number"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                placeholder="Enter saved card ID"
                min="1"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* AMOUNT */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* PAYMENT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Make Payment"}
            </button>

          </form>

          {/* BACK TO DASHBOARD */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-[#333333] dark:bg-[#101010] dark:text-gray-300 dark:hover:bg-[#1c1c1c]"
          >
            Back to Dashboard
          </button>

        </div>

      </main>
    </div>
  );
}

export default MakePayment;