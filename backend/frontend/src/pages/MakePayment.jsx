import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment, processPayment, getProfile } from "../services/api";

function MakePayment() {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Make Payment
        </h1>

        <p className="mb-6 text-gray-500">
          Enter the payment details below.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Card ID
            </label>

            <input
              type="number"
              value={cardId}
              onChange={(e) => setCardId(e.target.value)}
              placeholder="Enter saved card ID"
              min="1"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Make Payment"}
          </button>

        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default MakePayment;
