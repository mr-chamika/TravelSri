const BASE_URL = "http://<your-ip>:8080/api/auth";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return await res.json(); // { token, role }
};

export const signupUser = async (user: {
  email: string;
  password: string;
  role: string;
}) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Signup failed");

  return await res.json(); // Optional response
};
