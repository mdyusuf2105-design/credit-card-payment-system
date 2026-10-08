import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardSummary,
  downloadMonthlyStatement,
} from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const handleDownloadStatement = async () => {
    try {
      const now = new Date();

      await downloadMonthlyStatement(
        now.getFullYear(),
        now.getMonth() + 1
      );
    } catch (err) {
      alert(err.message || "Failed to download monthly statement");
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

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
              }}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Logout
            </button>

            {/* MONTHLY STATEMENT */}
            <button
              onClick={handleDownloadStatement}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Download Monthly Statement
            </button>

          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your cards, payments and transactions.
        </p>

        {/* ACTION CARDS */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* MY CARDS */}
          <button
            onClick={() => navigate("/add-card")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#292929] dark:bg-[#151515] dark:hover:bg-[#1c1c1c]"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Cards
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Add and manage your saved cards.
            </p>
          </button>

          {/* MAKE PAYMENT */}
          <button
            onClick={() => navigate("/make-payment")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#292929] dark:bg-[#151515] dark:hover:bg-[#1c1c1c]"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Make Payment
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Make a payment using your saved card.
            </p>
          </button>

          {/* TRANSACTIONS */}
          <button
            onClick={() => navigate("/transactions")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#292929] dark:bg-[#151515] dark:hover:bg-[#1c1c1c]"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transactions
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              View your payment history.
            </p>
          </button>

        </div>

        {/* ADMIN DASHBOARD */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-xl bg-gray-900 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Open Admin Dashboard
          </button>
        </div>

        {/* SPENDING SUMMARY */}
        <div className="mt-10">

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Spending Summary
          </h3>

          {/* LOADING */}
          {loading && (
            <div className="mt-5 grid gap-5 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-gray-200 shadow-sm dark:bg-[#151515]"
                />
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* SUMMARY DATA */}
          {summary && !loading && (
            <>
              <div className="mt-5 grid gap-5 md:grid-cols-4">

                {/* TOTAL SPENT */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {formatAmount(summary.total_amount_spent)}
                  </p>
                </div>

                {/* AVAILABLE CREDIT */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Available Credit
                  </p>

                  <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatAmount(summary.available_credit_limit)}
                  </p>
                </div>

                {/* TOTAL TRANSACTIONS */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Transactions
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.total_transactions}
                  </p>
                </div>

                {/* THIS MONTH */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This Month
                  </p>

                  <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatAmount(summary.current_month_spending)}
                  </p>
                </div>

              </div>

              {/* LAST 5 TRANSACTIONS */}
              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Last 5 Transactions
                </h3>

                {summary.last_5_transactions.length === 0 ? (
                  <p className="mt-5 text-gray-500 dark:text-gray-400">
                    No transactions found.
                  </p>
                ) : (
                  <div className="mt-5 overflow-x-auto">

                    <table className="w-full text-left">

                      <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-500 dark:border-[#292929] dark:text-gray-400">
                          <th className="px-3 py-3">Amount</th>
                          <th className="px-3 py-3">Card</th>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {summary.last_5_transactions.map(
                          (transaction, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 last:border-0 dark:border-[#292929]"
                            >

                              <td className="px-3 py-4 font-semibold text-gray-900 dark:text-gray-100">
                                {formatAmount(transaction.amount)}
                              </td>

                              <td className="px-3 py-4 text-gray-700 dark:text-gray-300">
                                {transaction.masked_card_number}
                              </td>

                              <td className="px-3 py-4 text-gray-700 dark:text-gray-300">
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString("en-IN")}
                              </td>

                              <td className="px-3 py-4">

                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    transaction.status === "SUCCESS"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                      : transaction.status === "FAILED"
                                      ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                                  }`}
                                >
                                  {transaction.status}
                                </span>

                              </td>

                            </tr>
                          )
                        )}
                      </tbody>

                    </table>

                  </div>
                )}

              </div>
            </>
          )}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;
