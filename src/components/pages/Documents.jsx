import React, { useState } from "react";
import "./Documents.css";

const AdvancedDocuments = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({ title: "", category: "", file: null });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdd = () => {
    if (!form.title || !form.category || !form.file) {
      alert("Please fill all fields and upload a file");
      return;
    }

    if (editingId) {
      setDocuments(
        documents.map((doc) =>
          doc.id === editingId ? { ...form, id: editingId } : doc
        )
      );
      setEditingId(null);
    } else {
      setDocuments([...documents, { ...form, id: Date.now() }]);
    }
    setForm({ title: "", category: "", file: null });
    document.getElementById("fileInput").value = "";
  };

  const handleEdit = (doc) => {
    setForm(doc);
    setEditingId(doc.id);
  };

  const handleDelete = (id) => setDocuments(documents.filter((d) => d.id !== id));

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`documents-container ${darkMode ? "dark" : ""}`}>
      {/* Top Bar */}
      <div className="top-bar">
        <h2>Documents</h2>
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Form */}
      <div className="doc-form">
        <input
          type="text"
          name="title"
          placeholder="Document Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category / Tag"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="file"
          id="fileInput"
          name="file"
          onChange={handleChange}
        />
        <button onClick={handleAdd}>{editingId ? "Update" : "Add"} Document</button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Document List */}
      <div className="documents-list">
        {filteredDocs.length === 0 ? (
          <p className="no-docs">No documents found.</p>
        ) : (
          filteredDocs.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="doc-icon">
                {doc.file ? doc.file.name.split(".").pop().toUpperCase() : "DOC"}
              </div>
              <div className="doc-info">
                <h4>{doc.title}</h4>
                <p>Category: {doc.category}</p>
                <p>File: {doc.file?.name}</p>
              </div>
              <div className="doc-actions">
                <button onClick={() => handleEdit(doc)}>Edit</button>
                <button onClick={() => handleDelete(doc.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdvancedDocuments;