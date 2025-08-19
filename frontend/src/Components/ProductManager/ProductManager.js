import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import jsPDF from 'jspdf';
import './ProductManager.css';

const URL = 'http://localhost:5000/products';

function ProductManager() {
  // ------------------- STATES -------------------
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // ------------------- SELECTED FIELDS FOR PDF -------------------
  const [selectedFields, setSelectedFields] = useState({
    product_id: true,
    product_name: true,
    price: true,
    description: true,
    photo: true,
    created_by: true
  });

  // ------------------- FORM INPUTS -------------------
  const defaultInputs = {
    product_id: '',
    product_name: '',
    price: '',
    description: '',
    photo: '',
    created_by: ''
  };

  const [inputs, setInputs] = useState(defaultInputs);
  const [editInputs, setEditInputs] = useState(defaultInputs);

  // ------------------- FETCH PRODUCTS -------------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(URL);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ------------------- HANDLE INPUT CHANGE -------------------
  const handleChange = e => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditChange = e => setEditInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // ------------------- ADD PRODUCT -------------------
  const handleAddProduct = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(URL, {
        ...inputs,
        product_id: Number(inputs.product_id),
        price: Number(inputs.price),
        created_by: Number(inputs.created_by)
      });
      setProducts([...products, res.data.product]);
      setInputs(defaultInputs);
      setShowAddForm(false);
      alert('Product added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add product! Check console for details.');
    }
  };

  // ------------------- EDIT PRODUCT -------------------
  const startEdit = product => {
    setEditingProductId(product._id);
    setEditInputs({ ...product });
  };

  const handleUpdateProduct = async e => {
    e.preventDefault();
    try {
      const res = await axios.put(`${URL}/${editingProductId}`, {
        ...editInputs,
        product_id: Number(editInputs.product_id),
        price: Number(editInputs.price),
        created_by: Number(editInputs.created_by)
      });
      setProducts(products.map(p => (p._id === editingProductId ? res.data.product : p)));
      setEditingProductId(null);
      alert('Product updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update product!');
    }
  };

  // ------------------- DELETE PRODUCT -------------------
  const handleDeleteProduct = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${URL}/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete product!');
    }
  };

  // ------------------- DOWNLOAD PDF -------------------
  const handleDownload = () => {
    if (!products.length) return alert('No products to download!');
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const title = 'Product Report';
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 15);
    doc.setFontSize(10);

    products.forEach((product, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`Product ${idx + 1}`, 10, y); y += 6;
      doc.setFont('helvetica', 'normal');

      Object.keys(selectedFields).forEach(key => {
        if (selectedFields[key]) {
          doc.text(`${key} : ${product[key] || ''}`, 12, y);
          y += 5;
        }
      });

      y += 3;
      if (y > 270) { doc.addPage(); y = 20; }
    });

    doc.save('product_report.pdf');
    alert('Product Report Downloaded!');
  };

  // ------------------- FILTERED PRODUCTS -------------------
  const filteredProducts = products.filter(product =>
    (product.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // ------------------- RENDER -------------------
  return (
    <div className="product-section">
      <Nav />
      <div className="title-container">
        <h2 className="Title">Product Management</h2>
      </div>

      <button className="add-user-toggle" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Add Product Form' : 'Show Add Product Form'}
      </button>

      {showAddForm && (
        <div className="add-product-container">
          <h3>Add New Product</h3>
          <form className="add-user-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label>Product ID</label>
              <input type="number" name="product_id" value={inputs.product_id} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" name="product_name" value={inputs.product_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input type="number" name="price" value={inputs.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" value={inputs.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Photo</label>
              <input type="text" name="photo" value={inputs.photo} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Created By</label>
              <input type="number" name="created_by" value={inputs.created_by} onChange={handleChange} required />
            </div>
            <button type="submit">Add Product</button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product Name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

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

      <div className="users-table-container">
        <span className="table-user-count">Total Products: {products.length}</span>
        <table className="users-table">
          <thead>
            <tr>
              {Object.keys(defaultInputs).map((key) => (<th key={key}>{key}</th>))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                {editingProductId === product._id ? (
                  <td colSpan={Object.keys(defaultInputs).length + 1}>
                    <div className="update-user-container">
                      <h1>Update Product</h1>
                      <form onSubmit={handleUpdateProduct}>
                        {Object.keys(editInputs).map(field => (
                          <div className="form-group" key={field}>
                            <input
                              type={field.includes('price') || field.includes('product_id') || field.includes('created_by') ? 'number' : 'text'}
                              name={field}
                              value={editInputs[field]}
                              onChange={handleEditChange}
                              required={field === "product_name" || field === "price" || field === "product_id" || field === "created_by"}
                              placeholder={field}
                            />
                          </div>
                        ))}
                        <button type="submit">Update</button>
                        <button type="button" className="delete-button" onClick={() => setEditingProductId(null)}>Cancel</button>
                      </form>
                    </div>
                  </td>
                ) : (
                  <>
                    {Object.keys(defaultInputs).map(field => <td key={field}>{product[field]}</td>)}
                    <td>
                      <button className="update-button" onClick={() => startEdit(product)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
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

export default ProductManager;