import React from 'react';

export default function Home() {
  return (
    <div>
      <div className="flex justify-center items-center h-screen px-8 -mt-5">
        <div className="max-w-4xl">
          <p className="text-center text-3xl text-stone-800">
            <span className="font-bold font-mono" >Orons Retro Shop</span> is a unique retro store for any tech enthusiast or collector.
            We offer a wide selection of items that are always being refreshed, all items available at our‎ ‎
            <a href="/store" className="underline italic text-yellow-600 hover:text-yellow-800">store</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
