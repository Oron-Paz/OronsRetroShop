import React from 'react';
import cassette from '../../public/site/cassetteForPaying.png';
import computer from '../../public/site/retroComputer2.png';
import Image from 'next/image';

function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex items-center space-x-8 max-w-4xl mx-auto">
                <div className="w-1/4">
                    <Image src={cassette} alt="cassette" width={150} height={150} objectFit="contain" />
                </div>
                <div className="w-1/2">
                    <div className="p-8 bg-white rounded-lg shadow-lg text-center">
                        <h1 className="text-2xl text-gray-800 font-semibold mb-4">Thank you for your purchase</h1>
                        <p className="text-lg text-gray-600">Your order will arrive soon!</p>
                    </div>
                </div>
                <div className="w-1/4">
                    <Image src={computer} alt="computer" width={150} height={150} objectFit="contain" />
                </div>
            </div>
        </div>
    );
}

export default Page;