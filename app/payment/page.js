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

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push('/paid');
       
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