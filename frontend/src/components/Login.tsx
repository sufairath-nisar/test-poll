

interface LoginProps {
  onLogin: (token: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function Login({ onLogin }: LoginProps) {
  async function handleLogin() {
    try {
      const res = await fetch(`${API_BASE}/auth/anon`, { method: 'POST' });
      const data = await res.json();
      onLogin(data.token);
    } catch {
      alert('Failed to login');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login Anonymously</button>
    </div>
  );
}
