const API_URL = "http://localhost:5000";

export const fetchTerenuri = async () => {
  const response = await fetch(`${API_URL}/terenuri`);
  return response.json();
};
