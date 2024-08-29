// app/payment/page.js

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';


const PaymentPage = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

    const handleCardNumberChange = (e) => {
        setCardNumber(e.target.value);
    };

    const handleExpiryDateChange = (e) => {
        setExpiryDate(e.target.value);
    };

    const handleCvvChange = (e) => {
        setCvv(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    
          const response = await fetch('/api/user/purchases', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: cart,
              totalAmount,
            }),
            credentials: 'include', // This ensures cookies are sent with the request
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to process purchase');
          }
    
          cart.forEach((item) => {
            removeFromCart(item.id);
          });
    
          router.push('/paid');
        } catch (error) {
          console.error('Error processing purchase:', error);
          alert('Failed to process purchase');
        }
      };

    return (
        <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6 text-center">Payment Page</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Card Number:</label>
                    <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={handleCardNumberChange} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="1234 5678 9101 1121"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Expiry Date:</label>
                    <input 
                        type="text" 
                        value={expiryDate} 
                        onChange={handleExpiryDateChange} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="MM/YY"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">CVV:</label>
                    <input 
                        type="text" 
                        value={cvv} 
                        onChange={handleCvvChange} 
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="123"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
                >
                    Pay
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;
