import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR — ORIGINAL */}
      <nav className="bg-blue-600 px-6 py-4 text-white shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">
            Credit Card Payment System
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              navigate("/login");
            }}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* ORIGINAL HEADER */}
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your cards, payments and transactions.
        </p>

        {/* ORIGINAL FUNCTIONAL BUTTONS — PRESERVED */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <button
            onClick={() => navigate("/add-card")}
            className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              My Cards
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Add and manage your saved cards.
            </p>
          </button>

          <button
            onClick={() => navigate("/make-payment")}
            className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Make Payment
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Make a payment using your saved card.
            </p>
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="rounded-xl bg-white p-6 text-left shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Transactions
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              View your payment history.
            </p>
          </button>
        </div>

        {/* ORIGINAL ADMIN BUTTON */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-xl bg-gray-900 px-6 py-4 font-semibold text-white shadow hover:bg-gray-800"
          >
            Open Admin Dashboard
          </button>
        </div>

        {/* NEW DASHBOARD SUMMARY */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800">
            Spending Summary
          </h3>

          {loading && (
            <div className="mt-5 grid gap-5 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl bg-white shadow"
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl bg-red-100 p-4 text-red-700">
              ⚠️ {error}
            </div>
          )}

          {summary && !loading && (
            <>
              <div className="mt-5 grid gap-5 md:grid-cols-4">
                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-gray-500">
                    Total Spent
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {formatAmount(summary.total_amount_spent)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-gray-500">
                    Available Credit
                  </p>
                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {formatAmount(summary.available_credit_limit)}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-gray-500">
                    Total Transactions
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {summary.total_transactions}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-5 shadow">
                  <p className="text-sm text-gray-500">
                    This Month
                  </p>
                  <p className="mt-2 text-2xl font-bold text-blue-600">
                    {formatAmount(summary.current_month_spending)}
                  </p>
                </div>
              </div>

              {/* LAST 5 TRANSACTIONS */}
              <div className="mt-8 rounded-xl bg-white p-6 shadow">
                <h3 className="text-xl font-bold text-gray-800">
                  Last 5 Transactions
                </h3>

                {summary.last_5_transactions.length === 0 ? (
                  <p className="mt-5 text-gray-500">
                    No transactions found.
                  </p>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b text-sm text-gray-500">
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
                              className="border-b last:border-0"
                            >
                              <td className="px-3 py-4 font-semibold">
                                {formatAmount(transaction.amount)}
                              </td>

                              <td className="px-3 py-4">
                                {transaction.masked_card_number}
                              </td>

                              <td className="px-3 py-4">
                                {new Date(
                                  transaction.date
                                ).toLocaleDateString("en-IN")}
                              </td>

                              <td className="px-3 py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    transaction.status === "SUCCESS"
                                      ? "bg-green-100 text-green-700"
                                      : transaction.status === "FAILED"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
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