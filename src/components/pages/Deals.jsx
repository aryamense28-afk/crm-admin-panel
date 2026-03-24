import React, { useState, useEffect } from 'react';
import './Deals.css';

const Deals = () => {
  // State management
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStage, setSelectedStage] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [newDeal, setNewDeal] = useState({
    company: '',
    value: '',
    stage: 'Lead',
    contact: '',
    contactEmail: '',
    contactPhone: '',
    probability: 0,
    expectedCloseDate: '',
    notes: ''
  });

  // Sample data initialization
  useEffect(() => {
    const initialDeals = [
      { 
        id: '#DL-1001', 
        company: 'Acme Corp', 
        value: 28500, 
        stage: 'Proposal', 
        contact: 'Aarya mense',
        contactEmail: 'aaryamense01@gmail.com',
        contactPhone: '555-0123',
        probability: 60,
        expectedCloseDate: '2023-07-15',
        notes: 'Interested in enterprise plan',
        date: '2023-06-15',
        lastActivity: '2023-06-20'
      },
      { 
        id: '#DL-1002', 
        company: 'Globex Inc', 
        value: 42000, 
        stage: 'Negotiation', 
        contact: 'Pratiksha Chavan',
        contactEmail: 'Pratikshachavan@gmail.com',
        contactPhone: '555-0456',
        probability: 80,
        expectedCloseDate: '2023-07-05',
        notes: 'Price negotiation in progress',
        date: '2023-06-18',
        lastActivity: '2023-06-22'
      },
      { 
        id: '#DL-1003', 
        company: 'Ravikiran Bharne', 
        value: 15750, 
        stage: 'Lead', 
        contact: 'abc',
        contactEmail: 'Ravikiranbharne01@gmail.com',
        contactPhone: '555-0789',
        probability: 20,
        expectedCloseDate: '2023-08-01',
        notes: 'Initial contact made',
        date: '2023-06-20',
        lastActivity: '2023-06-20'
      },
      { 
        id: '#DL-1004', 
        company: 'Stark Ind', 
        value: 95000, 
        stage: 'ClosedWon', 
        contact: '',
        contactEmail: 'tony@stark.com',
        contactPhone: '555-0987',
        probability: 100,
        expectedCloseDate: '2023-06-22',
        notes: 'Contract signed',
        date: '2023-06-22',
        lastActivity: '2023-06-22'
      },
      { 
        id: '#DL-1005', 
        company: 'Parker LLC', 
        value: 12300, 
        stage: 'ClosedLost', 
        contact: 'Peter Parker',
        contactEmail: 'peter@parker.com',
        contactPhone: '555-0654',
        probability: 0,
        expectedCloseDate: '2023-06-25',
        notes: 'Lost to competitor',
        date: '2023-06-25',
        lastActivity: '2023-06-25'
      }
    ];
    setDeals(initialDeals);
    setFilteredDeals(initialDeals);
  }, []);

  // Calculate stats
  const stats = [
    { label: 'Total Deals', value: deals.length, type: 'total' },
    { label: 'Total Revenue', value: `$${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`, type: 'revenue' },
    { label: 'Won Deals', value: deals.filter(d => d.stage === 'ClosedWon').length, type: 'won' },
    { label: 'Lost Deals', value: deals.filter(d => d.stage === 'ClosedLost').length, type: 'lost' },
    { label: 'Pipeline Value', value: `$${deals.filter(d => d.stage !== 'ClosedWon' && d.stage !== 'ClosedLost')
        .reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}`, type: 'pipeline' },
    { label: 'Avg Deal Size', value: `$${Math.round(deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length).toLocaleString()}`, type: 'avg' }
  ];

  // Stage colors and order
  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'ClosedWon', 'ClosedLost'];
  const stageColors = {
    Lead: '#ff9800',
    Qualified: '#2196f3',
    Proposal: '#9c27b0',
    Negotiation: '#ff5722',
    ClosedWon: '#4caf50',
    ClosedLost: '#f44336'
  };

  // Filter and search function
  useEffect(() => {
    let result = deals;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(deal => 
        deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by stage
    if (selectedStage !== 'All') {
      result = result.filter(deal => deal.stage === selectedStage);
    }
    
    // Sort deals
    result.sort((a, b) => {
      if (sortConfig.key === 'value') {
        return sortConfig.direction === 'asc' 
          ? a.value - b.value 
          : b.value - a.value;
      }
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
    
    setFilteredDeals(result);
  }, [searchTerm, selectedStage, deals, sortConfig]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Add new deal
  const handleAddDeal = (e) => {
    e.preventDefault();
    const newId = `#DL-${String(deals.length + 1001)}`;
    const dealToAdd = {
      ...newDeal,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      value: parseFloat(newDeal.value) || 0
    };
    
    setDeals([dealToAdd, ...deals]);
    setShowAddForm(false);
    setNewDeal({
      company: '',
      value: '',
      stage: 'Lead',
      contact: '',
      contactEmail: '',
      contactPhone: '',
      probability: 0,
      expectedCloseDate: '',
      notes: ''
    });
  };

  // Move to next stage
  const moveToNextStage = (dealId) => {
    setDeals(deals.map(deal => {
      if (deal.id === dealId) {
        const currentIndex = stages.indexOf(deal.stage);
        if (currentIndex < stages.length - 2) { // Don't move beyond ClosedWon/Lost
          return { ...deal, stage: stages[currentIndex + 1] };
        }
      }
      return deal;
    }));
  };

  // Delete deal
  const deleteDeal = (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(deal => deal.id !== dealId));
    }
  };

  // Update deal probability
  const updateProbability = (dealId, newProbability) => {
    setDeals(deals.map(deal =>
      deal.id === dealId ? { ...deal, probability: newProbability } : deal
    ));
  };

  return (
    <div className="deals-vibrant">
      {/* Header with Actions */}
      <div className="deals-header">
        <h2>Deals Dashboard</h2>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '×' : '+ New Deal'}
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-mini">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-mini ${stat.type}`}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      
      {/* Add Deal Form */}
      {showAddForm && (
        <div className="add-deal-form">
          <h3>Add New Deal</h3>
          <form onSubmit={handleAddDeal}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Company Name *"
                value={newDeal.company}
                onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Deal Value *"
                value={newDeal.value}
                onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <select
                value={newDeal.stage}
                onChange={(e) => setNewDeal({...newDeal, stage: e.target.value})}
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Contact Name *"
                value={newDeal.contact}
                onChange={(e) => setNewDeal({...newDeal, contact: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="email"
                placeholder="Contact Email"
                value={newDeal.contactEmail}
                onChange={(e) => setNewDeal({...newDeal, contactEmail: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Contact Phone"
                value={newDeal.contactPhone}
                onChange={(e) => setNewDeal({...newDeal, contactPhone: e.target.value})}
              />
            </div>
            <div className="form-row">
              <input
                type="date"
                placeholder="Expected Close Date"
                value={newDeal.expectedCloseDate}
                onChange={(e) => setNewDeal({...newDeal, expectedCloseDate: e.target.value})}
              />
              <input
                type="number"
                placeholder="Probability %"
                min="0"
                max="100"
                value={newDeal.probability}
                onChange={(e) => setNewDeal({...newDeal, probability: parseInt(e.target.value)})}
              />
            </div>
            <div className="form-row">
              <textarea
                placeholder="Notes..."
                value={newDeal.notes}
                onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Deal</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="search-mini"
          placeholder="Search deals by company, contact, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          className="stage-filter"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
        >
          <option value="All">All Stages</option>
          {stages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
      </div>
      
      {/* Deals Table */}
      <div className="table-mini">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('company')}>Company {sortConfig.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th onClick={() => handleSort('value')}>Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Stage</th>
              <th>Probability</th>
              <th>Contact</th>
              <th>Expected Close</th>
              <th onClick={() => handleSort('date')}>Created {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal, index) => (
              <tr key={index} className={deal.stage === 'ClosedWon' ? 'won-row' : deal.stage === 'ClosedLost' ? 'lost-row' : ''}>
                <td>{deal.id}</td>
                <td>
                  <strong>{deal.company}</strong>
                  {deal.notes && <span className="note-indicator" title={deal.notes}>📝</span>}
                </td>
                <td>${deal.value.toLocaleString()}</td>
                <td>
                  <span 
                    className="stage-mini" 
                    style={{ backgroundColor: stageColors[deal.stage] }}
                  >
                    {deal.stage.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </td>
                <td>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deal.probability}
                    onChange={(e) => updateProbability(deal.id, parseInt(e.target.value))}
                    className="probability-slider"
                  />
                  <span>{deal.probability}%</span>
                </td>
                <td>
                  {deal.contact}
                  {deal.contactEmail && <div className="contact-info">{deal.contactEmail}</div>}
                </td>
                <td>{deal.expectedCloseDate}</td>
                <td>{deal.date}</td>
                <td>
                  <button 
                    className="next-btn" 
                    onClick={() => moveToNextStage(deal.id)}
                    title="Move to next stage"
                    disabled={deal.stage.includes('Closed')}
                  >→</button>
                  <button 
                    className="del-btn" 
                    onClick={() => deleteDeal(deal.id)}
                    title="Delete deal"
                  >×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pipeline View */}
      <div className="pipeline-view">
        <h3>Pipeline View</h3>
        <div className="pipeline-stages">
          {stages.filter(s => !s.includes('Closed')).map(stage => (
            <div key={stage} className="pipeline-stage">
              <h4 style={{ borderBottomColor: stageColors[stage] }}>
                {stage}
                <span className="stage-count">
                  {deals.filter(d => d.stage === stage).length}
                </span>
              </h4>
              <div className="stage-deals">
                {deals.filter(d => d.stage === stage).map(deal => (
                  <div key={deal.id} className="stage-deal-card">
                    <div className="deal-card-header">
                      <strong>{deal.company}</strong>
                      <span>${deal.value.toLocaleString()}</span>
                    </div>
                    <div className="deal-card-body">
                      <div>Contact: {deal.contact}</div>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill" 
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;