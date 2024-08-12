//app/payment/page.js

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../hooks/useCart';

const PaymentPage = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const { cart, removeFromCart, updateQuantity } = useCart();
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
            // Clear the cart in a single operation
            const response = await fetch('/api/user/cart/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }
    
            // Update local state to reflect the empty cart
            cart.forEach((item) => {
                removeFromCart(item.id);
            });
    
            router.push('/paid');
        } catch (error) {
            console.error('Error clearing cart:', error);
            // Handle the error appropriately (e.g., show an error message to the user)
        }
    };

    return (
        <div>
            <h1>Payment Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Card Number:
                    <input type="text" value={cardNumber} onChange={handleCardNumberChange} />
                </label>
                <br />
                <label>
                    Expiry Date:
                    <input type="text" value={expiryDate} onChange={handleExpiryDateChange} />
                </label>
                <br />
                <label>
                    CVV:
                    <input type="text" value={cvv} onChange={handleCvvChange} />
                </label>
                <br />
                <button type="submit">Pay</button>
            </form>
        </div>
    );
};

export default PaymentPage;