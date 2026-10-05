import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
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
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your cards, payments and transactions.
        </p>

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

        <div className="mt-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="rounded-xl bg-gray-900 px-6 py-4 font-semibold text-white shadow hover:bg-gray-800"
          >
            Open Admin Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;