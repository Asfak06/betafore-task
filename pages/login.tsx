import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios'; // Make sure to install axios if you haven't already
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sessionMessage = getCookie('session_expired');
    if (sessionMessage) {
      setMessage(sessionMessage.toString());
      deleteCookie('session_expired'); // Clear the cookie
    }
  }, []);
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password,
          });
    
          const token = response.data.token; // Assuming the JWT token is in the response data
          if (token) {
            // Set a cookie named 'token'. maxAge is set to 10 minutes
            setCookie('token', token, { maxAge: 60*10, path: '/' });
            window.location.href = '/products'; // Redirect after successful login
          }
    
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError('Failed to login. Please check your credentials.');
        }
      };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Login</title>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        {message && <div className="alert text-red-600">{message}</div>}

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              required 
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required 
            />
          </div>

          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link href="/register">
              <div className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Need an account?
              </div>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
