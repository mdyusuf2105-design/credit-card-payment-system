import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Transactions() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadTransactions = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();

    loadTransactions({
      status,
      min_amount: minAmount,
      max_amount: maxAmount,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const clearFilters = () => {
    setStatus("");
    setMinAmount("");
    setMaxAmount("");
    setStartDate("");
    setEndDate("");

    loadTransactions();
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

      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transaction History
            </h1>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              View and filter your payment transactions.
            </p>
          </div>

        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            Filter Transactions
          </h2>

          <form
            onSubmit={handleFilter}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >

            {/* STATUS */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* MINIMUM AMOUNT */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum Amount
              </label>

              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Minimum amount"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              />
            </div>

            {/* MAXIMUM AMOUNT */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum Amount
              </label>

              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Maximum amount"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
              />
            </div>

            {/* START DATE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex items-end gap-3">

              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-[#333333] dark:bg-[#101010] dark:text-gray-300 dark:hover:bg-[#1c1c1c]"
              >
                Clear
              </button>

            </div>

          </form>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (

          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#292929] dark:bg-[#151515]">
            <p className="text-gray-600 dark:text-gray-400">
              Loading transactions...
            </p>
          </div>

        ) : transactions.length === 0 ? (

          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-[#292929] dark:bg-[#151515]">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions found.
            </p>
          </div>

        ) : (

          /* TRANSACTIONS TABLE */
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-100 dark:bg-[#1c1c1c]">
                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Payment ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Date
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-gray-200 transition-colors hover:bg-gray-50 dark:border-[#292929] dark:hover:bg-[#1c1c1c]"
                    >

                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                        {transaction.id}
                      </td>

                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                        {transaction.payment_id}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ₹{transaction.amount}
                      </td>

                      <td className="px-6 py-4">

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

                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          transaction.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>

        )}

      </div>
    </div>
  );
}

export default Transactions;