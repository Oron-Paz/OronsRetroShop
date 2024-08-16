"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import picture from '../public/avatar/defaultAvatar.png';

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      document.querySelectorAll('.floating-object').forEach((el, index) => {
        el.style.transform = `translateY(${scrollY * (0.1 * (index + 1))}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 h-screen w-full">
        </div>
      </div>
  
      {/* Main content */}
      <div className="relative z-10">
        {/* Hero section with floating objects */}
        <div className="flex flex-col items-start justify-center min-h-screen px-8 bg-white bg-opacity-80">
          <h1 className="text-9xl font-bold text-yellow-500 mb-20 mt-6 leading-none bottom-20">
            ORONS<br />RETRO<br />SHOP
          </h1>
          <div className="max-w-2xl mt-16 self-center">
            <p className="text-center text-3xl text-stone-800">
              A unique retro store for any tech enthusiast or collector.
              We offer a wide selection of items that are always being refreshed, all items available at our‎ ‎
              <a href="/store" className="underline italic font-bold hover:text-yellow-600">store</a>.
            </p>
          </div>
  
          {/* Floating objects */}
          <div className="floating-object absolute top-1/4 left-1/4 w-32 h-32">
            <Image src={picture} layout="fill" objectFit="contain" alt="Retro item 1" />
          </div>
          <div className="floating-object absolute top-1/4 right-1/4 w-40 h-40">
            <Image src={picture} layout="fill" objectFit="contain" alt="Retro item 2" />
          </div>
          {/* Add more floating objects as needed */}
        </div>
  
        {/* About section */}
        <div className="min-h-screen flex items-center justify-center px-8 py-16 bg-stone-100 bg-opacity-90 mt-24">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold mb-8 text-center text-stone-800">About Us</h2>
            <p className="text-xl text-stone-700 mb-6">
              At Orons Retro Shop, we're passionate about preserving and sharing the magic of retro technology. 
              Our curated collection spans decades, featuring everything from vintage computers and game consoles 
              to classic audio equipment and quirky gadgets that defined past eras.
            </p>
            <p className="text-xl text-stone-700 mb-6">
              Each item in our store tells a story of innovation and nostalgia. Whether you're a serious collector, 
              a tech history buff, or simply someone who appreciates the charm of yesteryear's gadgets, you'll find 
              something special here.
            </p>
            <p className="text-xl text-stone-700">
              We take pride in carefully sourcing and, when necessary, restoring our items to ensure they're not just 
              display pieces, but functional windows into the past. Visit our store to take a journey through time and 
              perhaps find that perfect piece of tech history you've been searching for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}