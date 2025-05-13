
const BASE_URL = "http://localhost:5000";

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);

    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(errorData.message || `Error: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const loginUser = async (formData) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    credentials: "include"
  };

  return fetchData("/auth/login", options);
}

export const registerUser = async (formData) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  };

  return fetchData("/auth/register", options);
}

export const forgotPassword = async (email) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email})
  };

  return fetchData("/auth/reset", options);
}

export const verifyResetCode = async (code) => {
  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  };

  return fetchData("/auth/verify-reset-code", options)
}

export const resetPassword = async (newPassword) => {
  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  };

  return fetchData("/auth/reset-password", options);
}

export const getCurrentUser = async () => {
  const options = {
    credentials: "include"
  }
  return fetchData("/auth/me", options);
}

export const handleLogout = async () => {
  const options = {
    method : "POST",
    credentials : "include"
  }

  return fetchData("/auth/logout", options);
}

export const fetchFields = async () => {
  return fetchData("/fields")
}

export const timeSlots = async (fieldId, date) => {
  const dateToUse = date || new Date().toISOString().split('T')[0];
  return fetchData(`/fields/${fieldId}/availability/?date=${encodeURIComponent(dateToUse)}`);
}

export const bookField = async (fieldId, slotId, date) => {
  const options = {
    method : "POST",
    credentials: "include"
  }

  return fetchData(`/fields/book/${fieldId}/${slotId}/?date=${encodeURIComponent(date)}`, options)
}

export const postField = async (data) => {
  const options = {
    method: "POST",
    credentials: "include",
    body: data
  }

  return fetchData("/fields/add", options)
}

export const deleteUser = async () => {
  const options = {
    method: "DELETE",
    credentials: "include"
  }

  return fetchData("/auth/delete-account", options);
}

export const getReservations = async () => {
  const options = {
    method: "GET",
    credentials: "include"
  }

  return fetchData("/fields/reservations-history", options);
}

export const cancelReservation = async (reservationId) => {
  const options = {
    method: "DELETE",
    credentials: "include"
  }

  return fetchData(`/fields/cancel-reservation/${reservationId}`, options)
}