import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-6xl font-bold">
          Betafore task 
        </h1>

        <p className="mt-3 text-2xl">
          <code className="p-3 font-mono text-lg bg-slate-900 rounded-md">
             {'< Login/Signup  below />'}
          </code>
        </p>

        <div className="flex mt-6">
          <Link href="/login">
            <div className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-700">
              Login
            </div>
          </Link>
          <Link href="/register">
            <div className="px-4 py-2 mx-2 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-700">
              Register
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
