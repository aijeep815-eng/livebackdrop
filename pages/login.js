import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setLoading(false);

    if (res?.error) {
      setError('Email or password is incorrect.');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p className="text-sm text-center mt-3">
        No account? <Link href="/register" className="text-blue-700 hover:underline">Register</Link>
      </p>
    </div>
  );
}
