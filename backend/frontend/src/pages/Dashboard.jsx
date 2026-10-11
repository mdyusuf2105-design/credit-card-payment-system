
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboardSummary,
  downloadMonthlyStatement,
} from "../services/api";
import { useTheme } from "../context/ThemeContext";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

function BarChart({ title, data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#292929] dark:bg-[#151515]">
      <h3 className="mb-5 text-lg font-bold">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data available yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span>{item.label}</span>
                <span className="font-semibold">{money(item.value)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.max((item.value / max) * 100, 1)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const [summaryResponse, monthlyResponse, categoryResponse, creditResponse] =
          await Promise.all([
            getDashboardSummary(),
            fetch("http://127.0.0.1:8001/dashboard/monthly-spending", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8001/dashboard/category-expenses", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8001/dashboard/credit-utilization", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setSummary(summaryResponse);

        const monthly = monthlyResponse.ok
          ? await monthlyResponse.json()
          : [];
        const categories = categoryResponse.ok
          ? await categoryResponse.json()
          : [];
        const credit = creditResponse.ok
          ? await creditResponse.json()
          : {};

        setAnalytics({ monthly, categories, credit });
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [navigate]);

  const handleDownloadStatement = async () => {
    try {
      const now = new Date();
      await downloadMonthlyStatement(now.getFullYear(), now.getMonth() + 1);
    } catch (err) {
      alert(err.message || "Failed to download monthly statement");
    }
  };

  const summaryValue = (key) => Number(summary?.[key] || 0);

  const monthlyData = Array.isArray(analytics?.monthly)
    ? analytics.monthly.map((item) => ({
        label: item.month || item.label || item.period || "Month",
        value: Number(item.total ?? item.amount ?? item.spending ?? 0),
      }))
    : Array.isArray(analytics?.monthly?.monthly_spending)
      ? analytics.monthly.monthly_spending.map((item) => ({
          label: item.month || item.label || "Month",
          value: Number(item.total ?? item.amount ?? item.spending ?? 0),
        }))
      : [];

  const categoryData = Array.isArray(analytics?.categories)
    ? analytics.categories.map((item) => ({
        label: item.category || item.name || "Other",
        value: Number(item.total ?? item.amount ?? item.spending ?? 0),
      }))
    : Array.isArray(analytics?.categories?.categories)
      ? analytics.categories.categories.map((item) => ({
          label: item.category || item.name || "Other",
          value: Number(item.total ?? item.amount ?? item.spending ?? 0),
        }))
      : [];

  const credit = analytics?.credit || {};
  const used = Number(
    credit.used_credit ?? credit.used ?? credit.total_spent ?? 0
  );
  const limit = Number(
    credit.total_credit_limit ?? credit.credit_limit ?? credit.total_limit ?? 0
  );
  const utilization = Number(
    credit.utilization_percentage ??
      credit.utilization_percent ??
      (limit > 0 ? (used / limit) * 100 : 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#050505] dark:text-gray-100">
      <nav className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-[#292929] dark:bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold">Credit Card Payment System</h1>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={toggleTheme} className="rounded-lg border px-4 py-2 text-sm">
              {darkMode ? "Light" : "Dark"}
            </button>
            <button
              onClick={handleDownloadStatement}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Download Monthly PDF
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/login");
              }}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your cards, payments and transactions.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            ["My Cards", "Add and manage your saved cards.", "/add-card"],
            ["Make Payment", "Pay using a saved card.", "/make-payment"],
            ["Transactions", "View your payment history.", "/transactions"],
          ].map(([title, description, path]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm hover:shadow-md dark:border-[#292929] dark:bg-[#151515]"
            >
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/admin-dashboard")}
          className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white dark:bg-white dark:text-black"
        >
          Open Admin Dashboard
        </button>

        {loading && <p className="mt-8">Loading dashboard...</p>}
        {error && (
          <p className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">{error}</p>
        )}

        {summary && !loading && (
          <>
            <h3 className="mt-10 text-2xl font-bold">Spending Summary</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Spent", money(summaryValue("total_amount_spent"))],
                ["Available Credit", money(summaryValue("available_credit_limit"))],
                ["Total Transactions", summaryValue("total_transactions")],
                ["This Month", money(summaryValue("current_month_spending"))],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-[#292929] dark:bg-[#151515]"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-10 text-2xl font-bold">Financial Analytics</h3>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <BarChart title="Monthly Spending" data={monthlyData} />
              <BarChart title="Category Expenses" data={categoryData} />

              <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#292929] dark:bg-[#151515]">
                <h3 className="text-lg font-bold">Credit Utilization</h3>
                <p className="mt-4 text-3xl font-bold">{utilization.toFixed(1)}%</p>
                <div className="mt-4 h-4 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full ${
                      utilization >= 80 ? "bg-red-600" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${Math.min(Math.max(utilization, 0), 100)}%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Used: {money(used)} / Limit: {money(limit)}
                </p>
              </section>
            </div>

            <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-[#292929] dark:bg-[#151515]">
              <h3 className="text-xl font-bold">Last 5 Transactions</h3>
              {(summary.last_5_transactions || []).length === 0 ? (
                <p className="mt-4 text-gray-500">No transactions found.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
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
                      {summary.last_5_transactions.map((transaction, index) => (
                        <tr key={transaction.id ?? index} className="border-b border-gray-100 dark:border-[#292929]">
                          <td className="px-3 py-4 font-semibold">{money(transaction.amount)}</td>
                          <td className="px-3 py-4">{transaction.masked_card_number || "—"}</td>
                          <td className="px-3 py-4">
                            {transaction.date
                              ? new Date(transaction.date).toLocaleDateString("en-IN")
                              : "—"}
                          </td>
                          <td className="px-3 py-4">{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
