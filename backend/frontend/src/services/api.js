const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function addCard(cardData) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/cards/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.card_number?.[0] ||
      data.cvv?.[0] ||
      "Failed to add card"
    );
  }

  return data;
}

export async function createPayment(paymentData) {
  const response = await fetch("http://127.0.0.1:8001/payments/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Payment creation failed");
  }

  return data;
}

export async function processPayment(paymentId) {
  const response = await fetch(
    `http://127.0.0.1:8001/payments/${paymentId}/process`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Payment processing failed");
  }

  return data;
}

export async function getTransactions(filters = {}) {
  const token = localStorage.getItem("access_token");

  const params = new URLSearchParams();

  if (filters.status) {
    params.append("status", filters.status);
  }

  if (filters.min_amount) {
    params.append("min_amount", filters.min_amount);
  }

  if (filters.max_amount) {
    params.append("max_amount", filters.max_amount);
  }

  if (filters.start_date) {
    params.append("start_date", filters.start_date);
  }

  if (filters.end_date) {
    params.append("end_date", filters.end_date);
  }

  const queryString = params.toString();

  const url = queryString
    ? `http://127.0.0.1:8000/api/transactions/?${queryString}`
    : "http://127.0.0.1:8000/api/transactions/";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load transactions");
  }

  return data;
}

export async function getAdminDashboard() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    "http://127.0.0.1:8000/api/transactions/admin-dashboard/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load admin dashboard");
  }

  return data;
}

export async function getCards() {
  const token = localStorage.getItem("access_token");

  const response = await fetch("http://127.0.0.1:8000/api/cards/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load cards");
  }

  return data;
}

export async function deleteCard(cardId) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `http://127.0.0.1:8000/api/cards/${cardId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Failed to delete card");
  }

  return true;
}

export async function getProfile() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load profile");
  }

  return data;
}

export async function getDashboardSummary() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    "http://127.0.0.1:8001/dashboard/summary",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load dashboard");
  }

  return data;
}

export async function getAdminCards() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    "http://127.0.0.1:8000/api/cards/admin/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.error || "Failed to load cards");
  }

  return response.json();
}

export async function updateAdminCard(cardId, payload) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `http://127.0.0.1:8000/api/cards/admin/${cardId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.detail || data.error || "Failed to update card"
    );
  }

  return response.json();
}
export async function downloadMonthlyStatement(year, month) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(
    `http://127.0.0.1:8001/statements/monthly?year=${year}&month=${month}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    let message = "Failed to download monthly statement";

    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // PDF/API error response was not JSON
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `monthly_statement_${year}_${String(month).padStart(2, "0")}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
}
