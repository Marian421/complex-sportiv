const BASE_URL = "http://localhost:5000";

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, options);
    //if (!response.ok) throw new Error(`Error: ${response.statusText}`);
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
    body: JSON.stringify(formData)
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