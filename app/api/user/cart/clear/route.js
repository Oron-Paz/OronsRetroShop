//app/api/user/cart/clear/route.js

import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../utils/authMiddleware';
import { getUserData, updateUser } from '../../../../utils/userManager';

export async function POST(request) {
    const token = request.cookies.get('token');
  
    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token.value);
    if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const userData = await getUserData(decoded.username);
        userData.cart = [];  // Clear the cart
        await updateUser(decoded.username, userData);

        return NextResponse.json({ message: 'Cart cleared successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return NextResponse.json({ error: 'Error clearing cart' }, { status: 500 });
    }
}