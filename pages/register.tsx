

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (registrationSuccess) {
      const timer = setTimeout(() => {
        router.push('/login'); // Redirect to the login page after 2 seconds
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess, router]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      console.log(response.data);
      setLoading(false);
      setRegistrationSuccess(true); 
    } catch (error) {
      setLoading(false);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Register</title>
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Register</h1>

        {error && <p className="text-red-500">{error}</p>}
        {registrationSuccess && <p className="text-green-500">Registration successful! Redirecting to login...</p>}

        {!registrationSuccess && (
        <form onSubmit={handleRegister} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
            Name
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            required 
          />
        </div>

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
            {loading ? 'Registering...' : 'Register'}
          </button>
          <Link href="/login">
            <div className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Already have an account?
            </div>
          </Link>
        </div>
      </form>
        )}

      </main>
    </div>
  );
};

export default Register;
