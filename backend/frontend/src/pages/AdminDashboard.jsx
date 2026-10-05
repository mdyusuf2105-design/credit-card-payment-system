import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminDashboard } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await getAdminDashboard();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 px-6 py-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900"
          >
            User Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <h2 className="text-3xl font-bold text-gray-800">
              Payment Overview
            </h2>

            <p className="mt-2 text-gray-500">
              Summary of payment and transaction activity.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Total Transactions
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-800">
                  {data.total_transactions}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Successful
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {data.successful_transactions}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Failed
                </p>
                <p className="mt-2 text-3xl font-bold text-red-600">
                  {data.failed_transactions}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Pending
                </p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {data.pending_transactions}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Successful Amount
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  ₹{data.successful_amount}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm text-gray-500">
                  Today's Transactions
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-800">
                  {data.today_transactions}
                </p>
              </div>

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;