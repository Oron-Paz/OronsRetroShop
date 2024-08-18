import React from 'react';

const Page = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-semibold text-center text-yellow-600 mb-8">LLM Questions and Answers Page</h1>
            
            <div className="space-y-8">
                <div className="border-b border-gray-300 pb-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Q: How can I make a dynamic navbar for my Next.js / React project?</h2>
                    <p className="text-gray-700 ml-4">
                        [Insert Answer Here]
                    </p>
                </div>

                <div className="border-b border-gray-300 pb-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">Q: I need to implement a user system but so that it's loaded from server-side data. Should I use a JSON file? And if so, how can I do such a thing?</h2>
                    <p className="text-gray-700 ml-4">
                        [Insert Answer Here]
                    </p>
                </div>

                {/* You can add more question-answer pairs by copying and pasting the div structure above */}
            </div>
        </div>
    );
};

export default Page;