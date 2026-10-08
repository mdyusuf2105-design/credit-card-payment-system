import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import {
  getAdminDashboard,
  getAdminCards,
  updateAdminCard,
} from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [data, setData] = useState(null);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCards = async () => {
    try {
      const result = await getAdminCards();
      setCards(result);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboard, cardData] = await Promise.all([
          getAdminDashboard(),
          getAdminCards(),
        ]);

        setData(dashboard);
        setCards(cardData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleBlockToggle = async (card) => {
    try {
      await updateAdminCard(card.id, {
        is_blocked: !card.is_blocked,
      });

      await loadCards();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreditLimit = async (card) => {
    const newLimit = prompt(
      "Enter new credit limit:",
      card.credit_limit
    );

    if (newLimit === null) return;

    const limit = Number(newLimit);

    if (!limit || limit <= 0) {
      alert("Enter a valid credit limit.");
      return;
    }

    try {
      await updateAdminCard(card.id, {
        credit_limit: limit,
      });

      await loadCards();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <p className="text-gray-600 dark:text-neutral-400">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">

      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-gray-900 px-6 py-4 text-white dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <h1 className="text-xl font-bold">
            Admin Dashboard
          </h1>

          <div className="flex items-center gap-3">

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            >
              {darkMode ? "Light" : "Dark"}
            </button>

            {/* USER DASHBOARD */}
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
            >
              User Dashboard
            </button>

          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* PAYMENT OVERVIEW */}
        {data && (
          <>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">
              Payment Overview
            </h2>

            <p className="mt-2 text-gray-500 dark:text-neutral-400">
              Summary of payment and transaction activity.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              {/* TOTAL TRANSACTIONS */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Total Transactions
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-neutral-100">
                  {data.total_transactions}
                </p>
              </div>

              {/* SUCCESSFUL */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Successful
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-500">
                  {data.successful_transactions}
                </p>
              </div>

              {/* FAILED */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Failed
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-500">
                  {data.failed_transactions}
                </p>
              </div>

              {/* PENDING */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-500">
                  {data.pending_transactions}
                </p>
              </div>

              {/* SUCCESSFUL AMOUNT */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Successful Amount
                </p>

                <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-500">
                  ₹{data.successful_amount}
                </p>
              </div>

              {/* TODAY'S TRANSACTIONS */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Today's Transactions
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-800 dark:text-neutral-100">
                  {data.today_transactions}
                </p>
              </div>

            </div>
          </>
        )}

        {/* CARD MANAGEMENT */}
        <section className="mt-12">

          <h2 className="text-3xl font-bold text-gray-800 dark:text-neutral-100">
            Card Management
          </h2>

          <p className="mt-2 text-gray-500 dark:text-neutral-400">
            View, block/unblock cards and update credit limits.
          </p>

          {/* TABLE */}
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-lg">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-900 text-left text-white dark:bg-neutral-800">
                <tr>
                  <th className="px-5 py-4">Card</th>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Credit Limit</th>
                  <th className="px-5 py-4">Transactions</th>
                  <th className="px-5 py-4">Activity</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>

                {cards.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-8 text-center text-gray-500 dark:text-neutral-400"
                    >
                      No cards found.
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr
                      key={card.id}
                      className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
                    >

                      {/* CARD */}
                      <td className="px-5 py-4 font-semibold text-gray-800 dark:text-neutral-100">
                        {card.masked_card}
                      </td>

                      {/* USER */}
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">
                        {card.email}
                      </td>

                      {/* CREDIT LIMIT */}
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">
                        ₹
                        {Number(card.credit_limit).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* TRANSACTIONS */}
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">
                        {card.transaction_count}
                      </td>

                      {/* ACTIVITY */}
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">
                        ₹
                        {Number(card.total_activity).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">

                        {card.is_blocked ? (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
                            Blocked
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-400">
                            Active
                          </span>
                        )}

                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() => handleBlockToggle(card)}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold text-white transition ${
                              card.is_blocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {card.is_blocked ? "Unblock" : "Block"}
                          </button>

                          <button
                            onClick={() => handleCreditLimit(card)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Limit
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;