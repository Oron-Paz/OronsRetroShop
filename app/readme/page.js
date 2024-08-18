import React from 'react';

const Page = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
            <h1 className="text-3xl font-bold text-center text-yellow-800 border-b-2 border-yellow-500 pb-4 mb-8">READ ME</h1>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">1. Author</h2>
                <p>This project was created by Oron Paz (ID: 326647914)</p>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">2. Store Name</h2>
                <p>OronRetroShop</p>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">3. Products</h2>
                <p>We sell retro/vintage tech items</p>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">4. Additional Pages</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Review Page</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li>Allows users to create reviews for the site</li>
                    <li>Includes like and dislike functionality</li>
                    <li>Shows which user posted each review</li>
                    <li>Limited to 9 reviews (oldest gets replaced)</li>
                    <li>Admin can delete reviews from the dashboard</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Support Page</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li>Provides information about accounts and the store</li>
                    <li>Accessible without sign-in, but some data may be missing</li>
                    <li>Fetches data from user profile or store/items</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Career Page</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li>Users can apply for positions at Oron's Retro Shop</li>
                    <li>Applications viewable in admin dashboard</li>
                    <li>Admin can delete and create job listings</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">Profile Page</h3>
                <ul className="list-disc pl-6 mb-4">
                    <li>Displays account creation date and last login</li>
                    <li>Allows users to change profile image</li>
                </ul>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">5. Challenges</h2>
                <p className="mb-2">The most challenging aspect was implementing cart features, particularly:</p>
                <ul className="list-disc pl-6">
                    <li>Handling deleted items that were in users' carts</li>
                    <li>Updating cart items when store items changed</li>
                    <li>Ensuring smooth integration between backend and frontend</li>
                </ul>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">6. Project Information</h2>
                <p>This project was completed individually by Oron Paz (ID: 326647914)</p>
            </section>
            
            <section className="bg-gray-100 rounded-lg p-6 mb-8 shadow-md">
                <h2 className="text-2xl font-semibold text-yellow-700 mb-4">7. Supported Routes</h2>
                <ul className="list-disc pl-6 grid grid-cols-2 gap-2">
                    <li>/ (root)</li>
                    <li>/store</li>
                    <li>/cart</li>
                    <li>/careers</li>
                    <li>/support</li>
                    <li>/admin</li>
                    <li>/paid</li>
                    <li>/payment</li>
                    <li>/profile</li>
                    <li>/readme</li>
                    <li>/Reviews</li>
                    <li>/signin</li>
                    <li>/signup</li>
                </ul>
            </section>
        </div>
    );
};

export default Page;