let token: string | null = null;

export async function getAnonToken() {
  if (!token) {
    const res = await fetch(import.meta.env.VITE_API_URL + "/auth/anon", { method: "POST" });
    const data = await res.json();
    token = data.token;
  }
  return token;
}
