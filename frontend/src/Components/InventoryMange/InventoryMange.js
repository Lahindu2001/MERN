import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import jsPDF from 'jspdf';
import './InventoryManage.css';
import './UpdateInventory.css';

const URL = 'http://localhost:5000/inventory';

function InventoryManage() {
  // ------------------- STATES -------------------
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  // ------------------- SELECTED FIELDS FOR PDF -------------------
  const [selectedFields, setSelectedFields] = useState({
    productName: true,
    category: true,
    description: true,
    stockQuantity: true,
    reorderLevel: true,
    reorderQuantity: true,
    stockLocation: true,
    purchasePrice: true,
    sellingPrice: true,
    supplier: true,
    warrantyPeriod: true,
    powerRating: true,
    manufacturer: true,
    modelNumber: true,
    itemStatus: true
  });

  // ------------------- FORM INPUTS -------------------
  const defaultInputs = {
    productName: '',
    category: '',
    description: '',
    stockQuantity: '',
    reorderLevel: '',
    reorderQuantity: '',
    stockLocation: '',
    purchasePrice: '',
    sellingPrice: '',
    supplier: '',
    warrantyPeriod: '',
    powerRating: '',
    manufacturer: '',
    modelNumber: '',
    itemStatus: 'Active'
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [editInputs, setEditInputs] = useState(defaultInputs);

  // ------------------- FETCH ITEMS -------------------
  const fetchItems = async () => {
    try {
      const res = await axios.get(URL);
      setItems(res.data.items || []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ------------------- HANDLE INPUT CHANGE -------------------
  const handleChange = e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditChange = e => setEditInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ------------------- ADD ITEM -------------------
  const handleAddItem = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(URL, {
        ...inputs,
        stockQuantity: Number(inputs.stockQuantity),
        reorderLevel: Number(inputs.reorderLevel),
        reorderQuantity: Number(inputs.reorderQuantity),
        purchasePrice: Number(inputs.purchasePrice),
        sellingPrice: Number(inputs.sellingPrice)
      });
      setItems([...items, res.data.item]);
      setInputs(defaultInputs);
      setShowAddForm(false);
      alert('Item added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add item! Check console for details.');
    }
  };

  // ------------------- EDIT ITEM -------------------
  const startEdit = item => {
    setEditingItemId(item._id);
    setEditInputs({ ...item });
  };

  const handleUpdateItem = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(`${URL}/${editingItemId}`, {
        ...editInputs,
        stockQuantity: Number(editInputs.stockQuantity),
        reorderLevel: Number(editInputs.reorderLevel),
        reorderQuantity: Number(editInputs.reorderQuantity),
        purchasePrice: Number(editInputs.purchasePrice),
        sellingPrice: Number(editInputs.sellingPrice)
      });
      setItems(items.map(i => (i._id === editingItemId ? res.data.item : i)));
      setEditingItemId(null);
      alert('Item updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update item!');
    }
  };

  // ------------------- DELETE ITEM -------------------
  const handleDeleteItem = async id => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${URL}/${id}`);
      setItems(items.filter(i => i._id !== id));
      alert('Item deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete item!');
    }
  };

  // ------------------- DOWNLOAD PDF -------------------
  const handleDownload = () => {
    if (!items.length) return alert('No items to download!');
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const title = 'Inventory Report';
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 15);
    doc.setFontSize(10);

    items.forEach((item, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Item ${idx + 1}`, 10, y); y += 6;
      doc.setFont('helvetica', 'normal');

      Object.keys(selectedFields).forEach(key => {
        if (selectedFields[key]) {
          doc.text(`${key} : ${item[key] || ''}`, 12, y);
          y += 5;
        }
      });

      y += 3;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('inventory_report.pdf');
    alert('Inventory Report Downloaded!');
  };

  // ------------------- FILTERED ITEMS -------------------
  const filteredItems = items.filter(item =>
    (item.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (item.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // ------------------- ENUMS -------------------
  const categories = ['Panel', 'Wire', 'Safety'];
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
  const statusOptions = ['Active', 'Inactive'];

  // ------------------- RENDER -------------------
  return (
    <div className="inventory-section">
      <Nav />
      <div className="title-container">
        <h2 className="Title">Inventory Management</h2>
      </div>

      <button className="add-user-toggle" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Item Form' : 'Show Add Item Form'}
      </button>

      {showAddForm && (
        <div className="add-user-container">
          <h3>Add New Item</h3>
          <form className="add-user-form" onSubmit={handleAddItem}>
            {/* ------------------- INPUTS ------------------- */}
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="productName" value={inputs.productName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={inputs.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={inputs.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" name="stockQuantity" value={inputs.stockQuantity} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Reorder Level</label>
              <input type="number" name="reorderLevel" value={inputs.reorderLevel} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Reorder Quantity</label>
              <input type="number" name="reorderQuantity" value={inputs.reorderQuantity} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stock Location</label>
              <select name="stockLocation" value={inputs.stockLocation} onChange={handleChange} required>
                <option value="">Select Location</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Purchase Price</label>
              <input type="number" name="purchasePrice" value={inputs.purchasePrice} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Selling Price</label>
              <input type="number" name="sellingPrice" value={inputs.sellingPrice} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Supplier</label>
              <input type="text" name="supplier" value={inputs.supplier} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Warranty Period</label>
              <input type="text" name="warrantyPeriod" value={inputs.warrantyPeriod} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Power Rating</label>
              <input type="text" name="powerRating" value={inputs.powerRating} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Manufacturer</label>
              <input type="text" name="manufacturer" value={inputs.manufacturer} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Model Number</label>
              <input type="text" name="modelNumber" value={inputs.modelNumber} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="itemStatus" value={inputs.itemStatus} onChange={handleChange}>
                {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <button type="submit">Add Item</button>
          </form>
        </div>
      )}

      {/* ------------------- SEARCH ------------------- */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product or Category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ------------------- PDF DOWNLOAD OPTIONS ------------------- */}
      <div className="download-options">
        <h3>Download Options</h3>
        {Object.keys(selectedFields).map(key => (
          <label key={key}>
            <input
              type="checkbox"
              checked={selectedFields[key]}
              onChange={() => setSelectedFields(prev => ({ ...prev, [key]: !prev[key] }))}
            /> {key}
          </label>
        ))}
        <button onClick={handleDownload}>Download Report</button>
      </div>

      {/* ------------------- ITEMS TABLE ------------------- */}
      <div className="users-table-container">
        <span className="table-user-count">Total Items: {items.length}</span>
        <table className="users-table">
          <thead>
            <tr>
              {Object.keys(defaultInputs).map((key) => (<th key={key}>{key}</th>))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item._id}>
                {editingItemId === item._id ? (
                  <td colSpan={Object.keys(defaultInputs).length + 1}>
                    <div className="update-user-container">
                      <h1>Update Item</h1>
                      <form onSubmit={handleUpdateItem}>
                        {Object.keys(editInputs).map(field => (
                          <div className="form-group" key={field}>
                            {field === "category" ? (
                              <select name={field} value={editInputs[field]} onChange={handleEditChange} required>
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                            ) : field === "stockLocation" ? (
                              <select name={field} value={editInputs[field]} onChange={handleEditChange} required>
                                <option value="">Select Location</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                              </select>
                            ) : field === "itemStatus" ? (
                              <select name={field} value={editInputs[field]} onChange={handleEditChange}>
                                {statusOptions.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            ) : (
                              <input
                                type={field.includes('Price') || field.includes('Quantity') ? 'number' : 'text'}
                                name={field}
                                value={editInputs[field]}
                                onChange={handleEditChange}
                                required={field === "stockQuantity" || field === "productName"}
                                placeholder={field}
                              />
                            )}
                          </div>
                        ))}
                        <button type="submit">Update</button>
                        <button type="button" className="delete-button" onClick={() => setEditingItemId(null)}>Cancel</button>
                      </form>
                    </div>
                  </td>
                ) : (
                  <>
                    {Object.keys(defaultInputs).map(field => <td key={field}>{item[field]}</td>)}
                    <td>
                      <button className="update-button" onClick={() => startEdit(item)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDeleteItem(item._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryManage;
