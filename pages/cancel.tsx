import React from 'react';
import Link from 'next/link';

const CancelPage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Canceled or Failed</h1>
      <p className="mb-4">Your payment was not successful. Please try again or contact support if you continue to have issues.</p>
      
      <Link href="/products">
        <div className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Return to Products
        </div>
      </Link>
    </div>
  );
};

export default CancelPage;
