import React, { useState } from 'react';
import './Contact.css';

const Contacts = () => {
  // Sample data
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Aarya Mense', email: 'aaryamense01@gmail.com', status: 'active' },
    { id: 2, name: 'Taniksha Shinde', email: 'tanikshashinde9696@gmail.com', status: 'inactive' },
    { id: 3, name: 'Dakshay Bhoslae', email: 'dakshaybhosale2654@gmail.com', status: 'active' },
    { id: 4, name: 'Pramod Sharma', email: 'pramodsharma@gmail.com', status: 'inactive' },
    { id: 5, name: 'Ashwin Malhotra', email: 'ashwinmalhotra@gmail.com', status: 'inactive' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);

  // Open modal for adding/editing contacts
  const openModal = (contact = null) => {
    setCurrentContact(contact);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentContact(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newContact = {
      id: currentContact ? currentContact.id : contacts.length + 1,
      name: formData.get('name'),
      email: formData.get('email'),
      status: formData.get('status'),
    };

    if (currentContact) {
      // Update existing contact
      setContacts(contacts.map((c) => (c.id === currentContact.id ? newContact : c)));
    } else {
      // Add new contact
      setContacts([...contacts, newContact]);
    }
    closeModal();
  };

  // Delete a contact
  const deleteContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="contacts-vibrant">
      {/* Header */}
      <div className="mini-header">
        <h3>Contacts</h3>
        <div className="mini-actions">
          <input
            type="text"
            className="mini-search"
            placeholder="Search contacts..."
          />
          <button className="mini-add" onClick={() => openModal()}>
            +
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mini-stats">
        <div className="mini-stat">
          <span className="stat-num">{contacts.length}</span>
          <span className="stat-label">Total Contacts</span>
        </div>
        <div className="mini-stat">
          <span className="stat-num">
            {contacts.filter((c) => c.status === 'active').length}
          </span>
          <span className="stat-label">Active</span>
        </div>
        <div className="mini-stat">
          <span className="stat-num">
            {contacts.filter((c) => c.status === 'inactive').length}
          </span>
          <span className="stat-label">Inactive</span>
        </div>
      </div>

      {/* Contact List */}
      <div className="contacts-list">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className="contact-info">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-email">{contact.email}</div>
              </div>
              <div className="contact-actions">
                <div
                  className={`status-dot ${contact.status}`}
                  title={contact.status === 'active' ? 'Active' : 'Inactive'}
                />
                <button
                  className="edit-btn"
                  title="Edit"
                  onClick={() => openModal(contact)}
                >
                  ✏️
                </button>
                <button
                  className="del-btn"
                  title="Delete"
                  onClick={() => deleteContact(contact.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mini-empty" />
        )}
      </div>

      {/* Modal for Adding/Editing Contacts */}
      {isModalOpen && (
        <div className="mini-modal-overlay" onClick={closeModal}>
          <div className="mini-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{currentContact ? 'Edit Contact' : 'Add Contact'}</h4>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={currentContact?.name}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={currentContact?.email}
                required
              />
              <select name="status" defaultValue={currentContact?.status || 'active'}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="mini-modal-actions">
                <button type="submit">{currentContact ? 'Update' : 'Add'}</button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;