import React from 'react';

export default function Home() {
  return (
    <div>
      <div class="flex justify-center items-center h-screen px-8 -mt-5">
        <div class="max-w-4xl">
          <p class="text-center text-3xl">
            <span class="font-bold font-mono">Orons Retro Shop</span> is a unique retro store for any tech enthusiast or collector.
            We offer a wide selection of items all available at our
            <a href="/store" class="underline italic text-yellow-600 hover:text-yellow-800"> store</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
