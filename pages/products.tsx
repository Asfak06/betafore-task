import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getCookie, setCookie } from 'cookies-next';
import { verifyToken } from '@/utils/auth'; // Adjust the import path as needed
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'next/router';



const stripePromise = loadStripe('pk_test_51MbbiGK3RZZOQUDyUZ1d2gykge07mITkbVF0iRh562tKlCjuQqeUmkNtWtmVgLfAsU0jKWQzIZhJ5EbGbvwUNEkT009qHJz7lC');

interface Product {
  id: number;
  title: string; // Changed from 'name' to 'title'
  price: number;
  thumbnail: string; // Changed from 'image' to 'thumbnail'
  // Add any additional fields that you might need from the API response
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get('https://dummyjson.com/products?limit=10');
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      setIsLoading(false); // Stop loading once data is fetched or an error occurs
    };
  
    fetchProducts();
  }, []);


  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prevSelectedProducts) => {
      const newSelectedProducts = new Map(prevSelectedProducts);
      if (newSelectedProducts.has(productId)) {
        newSelectedProducts.delete(productId);
      } else {
        newSelectedProducts.set(productId, 1);
      }
      return newSelectedProducts;
    });
  };

  const handleQuantityChange = (productId: number, increment: boolean) => {
    setSelectedProducts((prevSelectedProducts) => {
      const currentQuantity = prevSelectedProducts.get(productId) || 0;
      const newQuantity = increment ? currentQuantity + 1 : Math.max(currentQuantity - 1, 1);
      return new Map(prevSelectedProducts).set(productId, newQuantity);
    });
  };

  const isProductSelected = (productId: number) => selectedProducts.has(productId);

  const handleCheckout = async () => {
    const token = getCookie('token'); // Fetch the token from cookies

    if (!token) {
      // Handle case where token is not present
      router.push('/login?message=Session expired. Please log in again.');
      return;
    }
  
    // Verify the token by calling the API route
    try {
      const response = await axios.post('/api/verifyToken', { token });
      if (!response.data.valid) {
        setCookie('session_expired', 'Session expired. Please log in again.', { maxAge: 30 }); // 30 seconds expiration
        router.push('/login');
        return;
      }
    } catch (error) {
      setCookie('session_expired', 'Session expired. Please log in again.', { maxAge: 30 }); // 30 seconds expiration
      router.push('/login');
      return;
    }



    if (selectedProducts.size === 0) {
      alert('Please select at least one product to proceed to checkout.');
      return;
    }

    // Prepare the selected products
    const items = Array.from(selectedProducts.entries()).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      return { name: product.title, amount: product.price * 100, quantity };
    }).filter(item => item !== null);

    try {
      // Call your API to create a checkout session
      const { data } = await axios.post('/api/checkout', { items });

      // Redirect to Stripe Checkout
      const stripe:any = await stripePromise;
      const { error }= await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.log('Stripe checkout error:', error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-3xl font-bold">Loading...</div>;
  }


    return (
      <div className="container mx-auto p-4">
        <Head>
          <title>Products</title>
        </Head>
  
        <main>
          <h1 className="text-4xl font-bold my-10 text-center">Select Products</h1>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                className={`border p-4 rounded-lg shadow-lg cursor-pointer ${isProductSelected(product.id) ? 'border-blue-500' : ''}`}
                onClick={() => handleSelectProduct(product.id)}
              >
                <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover mb-3"/>
                <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
                <p className="mb-2">Price: ${product.price}</p>
                {isProductSelected(product.id) && (
                  <div className="flex items-center justify-between">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, false); }}
                    className="px-4 pt-1 pb-2 w-14 border rounded text-black bg-white font-bold text-2xl hover:opacity-70"
                  >
                    -
                  </button>
                  <span className='font-bold text-2xl'>{selectedProducts.get(product.id)}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, true); }}
                    className="px-4 pt-1 pb-2 w-14 border rounded text-black bg-white font-bold text-2xl hover:opacity-70"
                  >
                    +
                  </button>
                  </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleCheckout}
          // disabled={selectedProducts.size === 0}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        >
          Checkout
        </button>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getCookie('token', context);
  
  if (!token || !verifyToken(token as string)) {
    // Optionally set a cookie with the message
    setCookie('session_expired', 'Session expired. Please log in again.', { req: context.req, res: context.res, maxAge: 60 });

    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
export default Products;



