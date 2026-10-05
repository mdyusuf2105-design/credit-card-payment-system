import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCard, getCards, deleteCard } from "../services/api";

function AddCard() {
  const navigate = useNavigate();

  const [cardType, setCardType] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(true);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const data = await getCards();
      setCards(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCardsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addCard({
        card_type: cardType,
        card_number: cardNumber,
        cvv: cvv,
        card_holder_name: cardHolderName,
        expiry_month: Number(expiryMonth),
        expiry_year: Number(expiryYear),
      });

      alert("Card added successfully!");

      setCardNumber("");
      setCvv("");
      setCardHolderName("");
      setExpiryMonth("");
      setExpiryYear("");

      await loadCards();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this card?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCard(cardId);

      alert("Card deleted successfully!");

      await loadCards();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Add Card Section */}
        <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-lg">

          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Add Card
          </h1>

          <p className="mb-6 text-gray-500">
            Save your credit or debit card securely.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card Type
              </label>

              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card Number
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter 16-digit card number"
                maxLength="16"
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                CVV
              </label>

              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="Enter CVV"
                maxLength="4"
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Card Holder Name
              </label>

              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="Enter card holder name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry Month
                </label>

                <input
                  type="number"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  placeholder="MM"
                  min="1"
                  max="12"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry Year
                </label>

                <input
                  type="number"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  placeholder="YYYY"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding Card..." : "Add Card"}
            </button>

          </form>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>

        </div>

        {/* Saved Cards Section */}
        <div className="mx-auto mt-10 max-w-4xl">

          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Saved Cards
          </h2>

          <p className="mb-6 text-gray-500">
            Your saved credit and debit cards.
          </p>

          {cardsLoading ? (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              Loading saved cards...
            </div>
          ) : cards.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow">
              <p className="text-gray-500">
                No saved cards found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">

              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl bg-white p-6 shadow"
                >

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                      {card.card_type === "credit"
                        ? "Credit Card"
                        : "Debit Card"}
                    </h3>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      **** {card.last_four}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm">

                    <p>
                      <span className="font-semibold text-gray-700">
                        Card ID:
                      </span>{" "}
                      {card.id}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Card Number:
                      </span>{" "}
                      {card.masked_card}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Card Holder:
                      </span>{" "}
                      {card.card_holder_name}
                    </p>

                    <p>
                      <span className="font-semibold text-gray-700">
                        Expiry:
                      </span>{" "}
                      {String(card.expiry_month).padStart(2, "0")}/
                      {card.expiry_year}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">
                        Card ID:
                      </span>{" "}
                      {card.id}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    Delete Card
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default AddCard;