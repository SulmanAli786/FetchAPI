import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CRUD = () => {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const toggleForm = () => {
    setFormVisible(!formVisible);
    if (!formVisible) resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditId(null);
  };

  const handleInputChange = ({ target: { name, value } }) =>
    setFormData({ ...formData, [name]: value });

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5163/api/Category');
      if (!response.ok) throw new Error('Failed to fetch categories.');
      setData(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:5163/api/Category/${editId}`
      : 'http://localhost:5163/api/Category';
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to ${editId ? 'update' : 'create'} category.`);

      await fetchData();
      toggleForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (id) => {
    const category = data.find((item) => item.id === id);
    if (category) {
      setFormData({ name: category.name, description: category.description });
      setEditId(id);
      setFormVisible(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:5163/api/Category/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete category.');
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Category Management</h1>
      {error && <p className="text-danger">{error}</p>}

      <button className="btn btn-success mb-3" onClick={toggleForm}>
        {formVisible ? 'Cancel' : 'Add Category'}
      </button>
      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            className="form-control mb-2"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <button className="btn btn-primary" type="submit">
            {editId ? 'Update' : 'Submit'}
          </button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>
                <button className="btn btn-primary me-2" onClick={() => handleEdit(item.id)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CRUD;
