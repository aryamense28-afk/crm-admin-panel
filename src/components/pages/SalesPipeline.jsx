import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Salespipeline.css";

function SalesPipeline() {
  const [pipeline, setPipeline] = useState({
    lead: [
      { 
        id: 1, 
        name: "Client A", 
        company: "Acme Corp", 
        value: 50000, 
        probability: 20,
        contact: "John Doe",
        email: "john@acme.com",
        phone: "+1 234-567-890",
        lastContact: "2026-03-15",
        tags: ["hot", "enterprise"],
        notes: "Interested in enterprise plan"
      },
      { 
        id: 2, 
        name: "Client B", 
        company: "TechStart", 
        value: 25000, 
        probability: 30,
        contact: "Jane Smith",
        email: "jane@techstart.com",
        phone: "+1 234-567-891",
        lastContact: "2026-03-16",
        tags: ["startup"],
        notes: "Need demo next week"
      },
      { 
        id: 3, 
        name: "Client C", 
        company: "Global Inc", 
        value: 75000, 
        probability: 15,
        contact: "Bob Wilson",
        email: "bob@global.com",
        phone: "+1 234-567-892",
        lastContact: "2026-03-14",
        tags: ["hot", "negotiation"],
        notes: "Budget approved"
      }
    ],
    proposal: [
      { 
        id: 4, 
        name: "Client D", 
        company: "Innovate Ltd", 
        value: 35000, 
        probability: 60,
        contact: "Alice Brown",
        email: "alice@innovate.com",
        phone: "+1 234-567-893",
        lastContact: "2026-03-13",
        tags: ["proposal"],
        notes: "Proposal sent, awaiting feedback"
      }
    ],
    negotiation: [
      { 
        id: 5, 
        name: "Client E", 
        company: "MegaCorp", 
        value: 100000, 
        probability: 80,
        contact: "Charlie Davis",
        email: "charlie@megacorp.com",
        phone: "+1 234-567-894",
        lastContact: "2026-03-12",
        tags: ["hot", "closing"],
        notes: "Final terms discussion"
      }
    ],
    won: [
      { 
        id: 6, 
        name: "Client F", 
        company: "Success Co", 
        value: 45000, 
        probability: 100,
        contact: "Diana Evans",
        email: "diana@success.com",
        phone: "+1 234-567-895",
        lastContact: "2026-03-10",
        tags: ["won"],
        notes: "Contract signed"
      }
    ],
    lost: [
      { 
        id: 7, 
        name: "Client G", 
        company: "Lost Inc", 
        value: 15000, 
        probability: 0,
        contact: "Eve Foster",
        email: "eve@lost.com",
        phone: "+1 234-567-896",
        lastContact: "2026-03-08",
        tags: ["lost"],
        notes: "Went with competitor",
        lostReason: "Price too high"
      }
    ]
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterProbability, setFilterProbability] = useState("");
  const [showStats, setShowStats] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: "",
    company: "",
    value: "",
    probability: "20",
    contact: "",
    email: "",
    phone: "",
    tags: "",
    notes: ""
  });

  // Load from localStorage
  useEffect(() => {
    const savedPipeline = localStorage.getItem("salesPipeline");
    if (savedPipeline) {
      setPipeline(JSON.parse(savedPipeline));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("salesPipeline", JSON.stringify(pipeline));
  }, [pipeline]);

  const stages = [
    { id: "lead", name: "LEAD", icon: "🎯", color: "#3498db" },
    { id: "proposal", name: "PROPOSAL", icon: "📝", color: "#f39c12" },
    { id: "negotiation", name: "NEGOTIATION", icon: "🤝", color: "#9b59b6" },
    { id: "won", name: "WON", icon: "🏆", color: "#2ecc71" },
    { id: "lost", name: "LOST", icon: "❌", color: "#e74c3c" }
  ];

  // Move deal between stages
  const moveDeal = (deal, from, to) => {
    setPipeline(prev => {
      const updated = { ...prev };
      updated[from] = updated[from].filter(d => d.id !== deal.id);
      updated[to] = [...updated[to], { ...deal, probability: getProbabilityForStage(to) }];
      return updated;
    });
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage) return;

    const deal = pipeline[sourceStage].find(d => d.id.toString() === draggableId);
    if (deal) {
      moveDeal(deal, sourceStage, destStage);
    }
  };

  // Get probability based on stage
  const getProbabilityForStage = (stage) => {
    const probabilities = {
      lead: 20,
      proposal: 50,
      negotiation: 80,
      won: 100,
      lost: 0
    };
    return probabilities[stage] || 20;
  };

  // Calculate statistics
  const calculateStats = () => {
    let totalValue = 0;
    let weightedValue = 0;
    let wonValue = 0;
    let lostValue = 0;
    let totalDeals = 0;

    Object.entries(pipeline).forEach(([stage, deals]) => {
      deals.forEach(deal => {
        totalValue += deal.value || 0;
        weightedValue += (deal.value || 0) * ((deal.probability || 0) / 100);
        if (stage === 'won') wonValue += deal.value || 0;
        if (stage === 'lost') lostValue += deal.value || 0;
        totalDeals++;
      });
    });

    return {
      totalValue,
      weightedValue,
      wonValue,
      lostValue,
      totalDeals,
      conversionRate: totalDeals > 0 ? ((pipeline.won.length / totalDeals) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  // Add new deal
  const handleAddDeal = (e) => {
    e.preventDefault();
    if (!newDeal.name || !newDeal.company) return;

    const deal = {
      id: Date.now(),
      name: newDeal.name,
      company: newDeal.company,
      value: parseFloat(newDeal.value) || 0,
      probability: parseInt(newDeal.probability) || 20,
      contact: newDeal.contact,
      email: newDeal.email,
      phone: newDeal.phone,
      tags: newDeal.tags.split(',').map(t => t.trim()).filter(t => t),
      notes: newDeal.notes,
      lastContact: new Date().toISOString().split('T')[0]
    };

    setPipeline(prev => ({
      ...prev,
      lead: [...prev.lead, deal]
    }));

    setNewDeal({
      name: "",
      company: "",
      value: "",
      probability: "20",
      contact: "",
      email: "",
      phone: "",
      tags: "",
      notes: ""
    });
    setShowAddForm(false);
  };

  // Delete deal
  const deleteDeal = (dealId, stage) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      setPipeline(prev => ({
        ...prev,
        [stage]: prev[stage].filter(d => d.id !== dealId)
      }));
    }
  };

  // Update deal probability
  const updateProbability = (dealId, stage, newProbability) => {
    setPipeline(prev => ({
      ...prev,
      [stage]: prev[stage].map(deal =>
        deal.id === dealId ? { ...deal, probability: newProbability } : deal
      )
    }));
  };

  // Filter deals
  const getFilteredDeals = (stage) => {
    let deals = pipeline[stage] || [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      deals = deals.filter(deal =>
        deal.name.toLowerCase().includes(term) ||
        deal.company.toLowerCase().includes(term) ||
        (deal.contact && deal.contact.toLowerCase().includes(term))
      );
    }

    if (filterValue) {
      deals = deals.filter(deal => (deal.value || 0) >= parseInt(filterValue));
    }

    if (filterProbability) {
      deals = deals.filter(deal => (deal.probability || 0) >= parseInt(filterProbability));
    }

    return deals;
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="pipeline-container">
      {/* Header */}
      <div className="pipeline-header">
        <div className="header-left">
          <h1>
            <span className="header-icon">📊</span>
            Sales Pipeline
          </h1>
          <p className="header-subtitle">Track and manage your deals through the sales process</p>
        </div>

        <div className="header-actions">
          <button 
            className="add-deal-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕' : '+ New Deal'}
          </button>
          <button 
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? '📈 Hide Stats' : '📊 Show Stats'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="stats-cards">
          <div className="stat-card total">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-label">Total Pipeline Value</span>
              <span className="stat-value">{formatCurrency(stats.totalValue)}</span>
            </div>
          </div>

          <div className="stat-card weighted">
            <div className="stat-icon">⚖️</div>
            <div className="stat-content">
              <span className="stat-label">Weighted Pipeline</span>
              <span className="stat-value">{formatCurrency(stats.weightedValue)}</span>
            </div>
          </div>

          <div className="stat-card won">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-label">Won Deals</span>
              <span className="stat-value">{formatCurrency(stats.wonValue)}</span>
            </div>
          </div>

          <div className="stat-card conversion">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <span className="stat-label">Conversion Rate</span>
              <span className="stat-value">{stats.conversionRate}%</span>
            </div>
          </div>

          <div className="stat-card deals">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-label">Total Deals</span>
              <span className="stat-value">{stats.totalDeals}</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Deal Form */}
      {showAddForm && (
        <div className="add-deal-form">
          <h3>Add New Deal</h3>
          <form onSubmit={handleAddDeal}>
            <div className="form-row">
              <div className="form-group">
                <label>Deal Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Enterprise License"
                  value={newDeal.name}
                  onChange={(e) => setNewDeal({...newDeal, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({...newDeal, company: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Deal Value ($)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={newDeal.value}
                  onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="20"
                  value={newDeal.probability}
                  onChange={(e) => setNewDeal({...newDeal, probability: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newDeal.contact}
                  onChange={(e) => setNewDeal({...newDeal, contact: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={newDeal.email}
                  onChange={(e) => setNewDeal({...newDeal, email: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="+1 234-567-890"
                  value={newDeal.phone}
                  onChange={(e) => setNewDeal({...newDeal, phone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="hot, enterprise"
                  value={newDeal.tags}
                  onChange={(e) => setNewDeal({...newDeal, tags: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                placeholder="Additional notes..."
                rows="3"
                value={newDeal.notes}
                onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Create Deal</button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search deals by name, company, contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="filter-select"
          >
            <option value="">All Values</option>
            <option value="10000">$10k+</option>
            <option value="50000">$50k+</option>
            <option value="100000">$100k+</option>
          </select>

          <select
            value={filterProbability}
            onChange={(e) => setFilterProbability(e.target.value)}
            className="filter-select"
          >
            <option value="">All Probabilities</option>
            <option value="50">50%+</option>
            <option value="75">75%+</option>
            <option value="90">90%+</option>
          </select>
        </div>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="pipeline-board">
          {stages.map(stage => {
            const stageDeals = getFilteredDeals(stage.id);
            const stageTotal = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    className={`pipeline-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="column-header" style={{ backgroundColor: stage.color }}>
                      <span className="stage-icon">{stage.icon}</span>
                      <h3>{stage.name}</h3>
                      <div className="stage-stats">
                        <span className="deal-count">{stageDeals.length}</span>
                        <span className="stage-value">{formatCurrency(stageTotal)}</span>
                      </div>
                    </div>

                    <div className="column-content">
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.id.toString()}
                          draggableId={deal.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`deal-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedDeal(deal)}
                            >
                              <div className="deal-header">
                                <h4>{deal.name}</h4>
                                <span className="deal-company">{deal.company}</span>
                              </div>

                              <div className="deal-body">
                                <div className="deal-value">
                                  <span className="label">Value:</span>
                                  <span className="value">{formatCurrency(deal.value)}</span>
                                </div>

                                <div className="deal-probability">
                                  <span className="label">Probability:</span>
                                  <div className="probability-bar">
                                    <div 
                                      className="probability-fill"
                                      style={{ width: `${deal.probability}%` }}
                                    ></div>
                                  </div>
                                  <span className="probability-value">{deal.probability}%</span>
                                </div>

                                {deal.contact && (
                                  <div className="deal-contact">
                                    <span className="contact-icon">👤</span>
                                    <span>{deal.contact}</span>
                                  </div>
                                )}

                                {deal.tags && deal.tags.length > 0 && (
                                  <div className="deal-tags">
                                    {deal.tags.map(tag => (
                                      <span key={tag} className="tag">{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="deal-footer">
                                <span className="last-contact">
                                  📅 {deal.lastContact}
                                </span>
                                <div className="deal-actions">
                                  <select
                                    className="move-select"
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        moveDeal(deal, stage.id, e.target.value);
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="">Move to...</option>
                                    {stages.map(s => (
                                      <option key={s.id} value={s.id}>
                                        {s.icon} {s.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button 
                                    className="delete-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteDeal(deal.id, stage.id);
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Deal Details Modal */}
      {selectedDeal && (
        <div className="deal-modal" onClick={() => setSelectedDeal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deal Details</h2>
              <button className="close-modal" onClick={() => setSelectedDeal(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-group">
                  <label>Deal Name</label>
                  <p>{selectedDeal.name}</p>
                </div>
                <div className="detail-group">
                  <label>Company</label>
                  <p>{selectedDeal.company}</p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>Value</label>
                  <p className="value-large">{formatCurrency(selectedDeal.value)}</p>
                </div>
                <div className="detail-group">
                  <label>Probability</label>
                  <div className="probability-large">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${selectedDeal.probability}%` }}
                      ></div>
                    </div>
                    <span>{selectedDeal.probability}%</span>
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>Contact Person</label>
                  <p>{selectedDeal.contact || 'N/A'}</p>
                </div>
                <div className="detail-group">
                  <label>Email</label>
                  <p>{selectedDeal.email || 'N/A'}</p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-group">
                  <label>Phone</label>
                  <p>{selectedDeal.phone || 'N/A'}</p>
                </div>
                <div className="detail-group">
                  <label>Last Contact</label>
                  <p>{selectedDeal.lastContact}</p>
                </div>
              </div>

              {selectedDeal.tags && selectedDeal.tags.length > 0 && (
                <div className="detail-group">
                  <label>Tags</label>
                  <div className="tag-list">
                    {selectedDeal.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDeal.notes && (
                <div className="detail-group">
                  <label>Notes</label>
                  <p className="notes">{selectedDeal.notes}</p>
                </div>
              )}

              {selectedDeal.lostReason && (
                <div className="detail-group lost-reason">
                  <label>Lost Reason</label>
                  <p>{selectedDeal.lostReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesPipeline;