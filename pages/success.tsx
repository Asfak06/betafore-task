import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const SuccessPage = () => {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { session_id } = router.query;
      if (session_id) {
        try {
          const response = await axios.get(`/api/retrieve-session?sessionId=${session_id}`);
          setSession(response.data);
        } catch (error) {
          console.error('Error retrieving session:', error);
          // Handle error (e.g., display a message to the user)
        }
      }
    };

    fetchSession();
  }, [router.query]);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-4">Thank you for your purchase.</p>
      {/* Optional: Display session details */}
      
      <Link href="/products">
        <div className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Continue Shopping
        </div>
      </Link>
    </div>
  );
};

export default SuccessPage;
