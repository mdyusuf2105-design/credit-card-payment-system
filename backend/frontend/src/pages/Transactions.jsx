import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../services/api";

function Transactions() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Transaction History
            </h1>

            <p className="mt-1 text-gray-500">
              View and filter your payment transactions.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Filter Transactions
          </h2>

          <form
            onSubmit={handleFilter}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >

            {/* Status */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="">All Statuses</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {/* Minimum Amount */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Minimum Amount
              </label>

              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder="Minimum amount"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Maximum Amount */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Maximum Amount
              </label>

              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                placeholder="Maximum amount"
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-end gap-3">

              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Clear
              </button>

            </div>

          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Transactions */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No transactions found.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Payment ID
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-gray-200"
                    >

                      <td className="px-6 py-4">
                        {transaction.id}
                      </td>

                      <td className="px-6 py-4">
                        {transaction.payment_id}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        ₹{transaction.amount}
                      </td>

                      <td className="px-6 py-4">

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

                      <td className="px-6 py-4 text-sm text-gray-500">
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