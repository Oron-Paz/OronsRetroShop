//app/store/page.js

'use client';

import { useState, useEffect } from 'react';
import Item from '../components/Item';
import Notification from '../components/Notification';

export default function StorePage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch items from your API
    const fetchItems = async () => {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Store</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-8 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Item
            key={item.id}
            {...item}
            onAddToCart={() => showNotification(`${item.name} added to cart`)}
          />
        ))}
      </div>
      {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
}