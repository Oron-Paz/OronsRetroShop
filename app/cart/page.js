'use client';

import { useCart } from '../hooks/useCart.js';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CartImage from '../../public/site/emptyCart.png';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // This will be handled by the useEffect redirect
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handlePayment = () => {
    
    router.push('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div>
         <p class="text-gray-700 text-lg">Your cart is empty.</p>
          <p class="text-gray-700 text-lg">
          It's lonely here, why don't we go to the <Link href="/shop" class="text-yellow-600 underline">shop</Link> to add some items.
          </p>
          <Image src={CartImage} alt="Empty Cart" width={300} height={300} className="mx-auto block filter grayscale"/>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center mb-4 p-4 border rounded">
              <div className="w-24 h-24 mr-4 relative">
                <Image
                  src={item.image || '/placeholder.jpg'}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex-grow font-mono">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p>Description: {item.description}</p>
                <p>Price: ${item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end font-mono">
                <p className="font-bold mb-2">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-8 flex justify-between items-center font-mono">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handlePayment}
              className="bg-yellow-500 text-stone-800 px-6 py-3 rounded hover:bg-yellow-600 transition-colors text-lg"
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}