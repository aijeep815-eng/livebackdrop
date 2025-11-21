import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function Register() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    fetch('/api/ping').catch(() => {});
    if (session?.user) router.replace('/');
  }, [session, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register failed');
      const loginRes = await signIn('credentials', { redirect: false, email, password, callbackUrl: '/' });
      if (loginRes?.error) throw new Error('Auto login failed.');
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="max-w-md mx-auto mt-28 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name (optional)</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <button onClick={handleGoogle} disabled={googleLoading} className="w-full border border-gray-300 rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100">
        <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
        <span className="text-gray-700 font-medium">{googleLoading ? 'Connecting…' : 'Continue with Google'}</span>
      </button>
      <p className="text-sm text-center mt-3">
        Already have an account? <Link href="/login" className="text-blue-700 hover:underline">Login</Link>
      </p>
    </div>
  );
}
