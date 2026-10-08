import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCard, getCards, deleteCard } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function AddCard() {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

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

        {/* ADD CARD SECTION */}
        <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-colors duration-300 dark:border-[#292929] dark:bg-[#151515]">

          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Add Card
          </h1>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            Save your credit or debit card securely.
          </p>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-[#180909] dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* CARD TYPE */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Card Type
              </label>

              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
              </select>
            </div>

            {/* CARD NUMBER */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Card Number
              </label>

              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter 16-digit card number"
                maxLength="16"
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* CVV */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                CVV
              </label>

              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="Enter CVV"
                maxLength="4"
                inputMode="numeric"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* CARD HOLDER */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Card Holder Name
              </label>

              <input
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                placeholder="Enter card holder name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                required
              />
            </div>

            {/* EXPIRY */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiry Month
                </label>

                <input
                  type="number"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  placeholder="MM"
                  min="1"
                  max="12"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiry Year
                </label>

                <input
                  type="number"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value)}
                  placeholder="YYYY"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-[#333333] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600"
                  required
                />
              </div>

            </div>

            {/* ADD CARD */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding Card..." : "Add Card"}
            </button>

          </form>

          {/* BACK */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-[#333333] dark:bg-[#101010] dark:text-gray-300 dark:hover:bg-[#1c1c1c]"
          >
            Back to Dashboard
          </button>

        </div>

        {/* SAVED CARDS */}
        <div className="mx-auto mt-10 max-w-4xl">

          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Saved Cards
          </h2>

          <p className="mb-6 text-gray-500 dark:text-gray-400">
            Your saved credit and debit cards.
          </p>

          {/* LOADING */}
          {cardsLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-[#292929] dark:bg-[#151515]">
              <p className="text-gray-600 dark:text-gray-400">
                Loading saved cards...
              </p>
            </div>

          ) : cards.length === 0 ? (

            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-[#292929] dark:bg-[#151515]">
              <p className="text-gray-500 dark:text-gray-400">
                No saved cards found.
              </p>
            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg dark:border-[#292929] dark:bg-[#151515] dark:hover:bg-[#1c1c1c]"
                >

                  {/* CARD HEADER */}
                  <div className="flex items-center justify-between">

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {card.card_type === "credit"
                        ? "Credit Card"
                        : "Debit Card"}
                    </h3>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                      **** {card.last_four}
                    </span>

                  </div>

                  {/* CARD DETAILS */}
                  <div className="mt-5 space-y-3 text-sm">

                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">
                        Card ID:
                      </span>{" "}
                      {card.id}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">
                        Card Number:
                      </span>{" "}
                      {card.masked_card}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">
                        Card Holder:
                      </span>{" "}
                      {card.card_holder_name}
                    </p>

                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-gray-900 dark:text-gray-200">
                        Expiry:
                      </span>{" "}
                      {String(card.expiry_month).padStart(2, "0")}/
                      {card.expiry_year}
                    </p>

                  </div>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
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