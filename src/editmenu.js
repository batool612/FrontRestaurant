import React, { useState, useEffect } from 'react';
import { fetchMenuItems, editMenuItem, deleteMenuItem } from './api'; // API functions for menu items
import './editmenu.css';

const EditMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); // Admin token

  useEffect(() => {
    // Fetch all menu items when the page loads
    const fetchItems = async () => {
      try {
        const response = await fetchMenuItems(token);
        setMenuItems(response.data.menuItems);
      } catch (error) {
        setMessage('Failed to fetch menu items.');
      }
    };

    fetchItems();
  }, [token]);

  const handleEditClick = (item) => {
    setEditItem(item); // Set the current item for editing
    setFormData({ ...item });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await editMenuItem(editItem._id, formData, token); // API call to edit menu item
      setMessage(response.data.message);
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === editItem._id ? { ...item, ...formData } : item
        )
      );
      setEditItem(null); // Reset after editing
    } catch (error) {
      setMessage('Failed to edit menu item.');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await deleteMenuItem(itemId, token); // API call to delete menu item
      setMessage(response.data.message);
      setMenuItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    } catch (error) {
      setMessage('Failed to delete menu item.');
    }
  };

  return (
    <div className="edit-menu-container">
      <h2>Edit Menu Items</h2>
      {message && <p className="message">{message}</p>}

      <div className="menu-list">
        <h3>Menu Items</h3>
        <ul>
          {menuItems.map((item) => (
            <li key={item._id}>
              <strong>{item.name}</strong> - {item.category} - ${item.price}
              <p>{item.description}</p>
              <button onClick={() => handleEditClick(item)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {editItem && (
        <div className="edit-form">
          <h3>Edit Item</h3>
          <form onSubmit={handleSave}>
            <label>
              Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Category:
              <input
                type="text"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              ></textarea>
            </label>
            <label>
              Price:
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
            </label>
            <button type="submit">Save</button>
            <button onClick={() => setEditItem(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditMenu;
