//app/components/Item.js

'use client';

import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart.js';
import { useRouter } from 'next/navigation';

export default function Item({ id, name, description, imageUrl, price }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else {
      addToCart({ id, name, description ,price, quantity: 1 });
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <Image src={imageUrl} alt={name} width={200} height={200} className="w-full h-48 object-cover mb-4" />
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-lg font-semibold mb-4">${price}</p>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}