import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreManager = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '', image: '' });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/items', newItem);
      setNewItem({ name: '', price: '', description: '', image: '' });
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/items/${editingItem._id}`, editingItem);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Store Manager</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Item</h2>
        <form onSubmit={handleAddItem} className="space-y-2">
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          ></textarea>
          <input
            type="text"
            name="image"
            value={newItem.image}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Item</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Current Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="border p-4 rounded">
              {editingItem && editingItem._id === item._id ? (
                <form onSubmit={handleUpdateItem} className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editingItem.name}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={editingItem.price}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <textarea
                    name="description"
                    value={editingItem.description}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded"
                    required
                  ></textarea>
                  <input
                    type="text"
                    name="image"
                    value={editingItem.image}
                    onChange={(e) => handleInputChange(e, true)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded">Update</button>
                  <button onClick={() => setEditingItem(null)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>{item.description}</p>
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover mt-2" />
                  <div className="mt-2">
                    <button onClick={() => handleEditItem(item)} className="bg-yellow-500 text-white p-2 rounded mr-2">Edit</button>
                    <button onClick={() => handleDeleteItem(item._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreManager;