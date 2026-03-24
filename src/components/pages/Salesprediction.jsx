import React, { useState, useEffect } from "react";
import "./SalesPrediction.css";

export default function SalesPrediction() {
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem("salesPredictions");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    id: null,
    product: "",
    category: "Electronics",
    price: "",
    quantity: "",
    season: "Spring",
    marketingBudget: "",
    competitorPrice: "",
    customerRating: "4",
    previousSales: "",
    prediction: null,
    confidence: null
  });

  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    localStorage.setItem("salesPredictions", JSON.stringify(predictions));
  }, [predictions]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // AI Prediction Algorithm
  const generatePrediction = () => {
    setIsPredicting(true);
    
    setTimeout(() => {
      const price = Number(form.price) || 1000;
      const quantity = Number(form.quantity) || 100;
      const budget = Number(form.marketingBudget) || 5000;
      const competitorPrice = Number(form.competitorPrice) || price * 0.9;
      const rating = Number(form.customerRating) || 4;
      const previousSales = Number(form.previousSales) || quantity * 0.8;

      // Complex prediction algorithm
      const priceFactor = 1 - (Math.abs(price - competitorPrice) / competitorPrice) * 0.3;
      const budgetFactor = Math.min(budget / 10000, 1.5);
      const ratingFactor = rating / 5;
      const seasonalFactor = getSeasonalFactor(form.season);
      const historicalFactor = previousSales / quantity;

      const basePrediction = quantity * price;
      const adjustedPrediction = basePrediction * priceFactor * budgetFactor * ratingFactor * seasonalFactor * historicalFactor;
      
      const finalPrediction = Math.round(adjustedPrediction);
      const confidence = Math.round(
        (priceFactor * 0.3 + budgetFactor * 0.2 + ratingFactor * 0.2 + seasonalFactor * 0.15 + historicalFactor * 0.15) * 100
      );

      setForm({
        ...form,
        prediction: finalPrediction,
        confidence: Math.min(confidence, 98)
      });
      
      setIsPredicting(false);
    }, 1500);
  };

  const getSeasonalFactor = (season) => {
    const factors = {
      "Spring": 1.2,
      "Summer": 1.1,
      "Fall": 1.0,
      "Winter": 1.3,
      "Holiday": 1.5
    };
    return factors[season] || 1.0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.product || !form.price || !form.quantity) {
      showNotification("Please fill required fields", "error");
      return;
    }

    if (!form.prediction) {
      showNotification("Generate prediction first", "warning");
      return;
    }

    const predictionData = {
      ...form,
      id: editing ? form.id : Date.now(),
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    if (editing) {
      setPredictions(predictions.map(p => p.id === form.id ? predictionData : p));
      showNotification("✅ Prediction updated successfully!", "success");
    } else {
      setPredictions([...predictions, predictionData]);
      showNotification("🎯 Prediction saved successfully!", "success");
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: null,
      product: "",
      category: "Electronics",
      price: "",
      quantity: "",
      season: "Spring",
      marketingBudget: "",
      competitorPrice: "",
      customerRating: "4",
      previousSales: "",
      prediction: null,
      confidence: null
    });
    setEditing(false);
  };

  const editPrediction = (item) => {
    setForm(item);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePrediction = (id) => {
    if (window.confirm("Are you sure you want to delete this prediction?")) {
      setPredictions(predictions.filter(p => p.id !== id));
      showNotification("🗑️ Prediction deleted", "warning");
    }
  };

  const deleteSelected = () => {
    if (selectedItems.length === 0) return;
    if (window.confirm(`Delete ${selectedItems.length} selected predictions?`)) {
      setPredictions(predictions.filter(p => !selectedItems.includes(p.id)));
      setSelectedItems([]);
      showNotification(`🗑️ ${selectedItems.length} predictions deleted`, "warning");
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredPredictions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPredictions.map(p => p.id));
    }
  };

  // Filtering and Sorting
  const filteredPredictions = predictions
    .filter(p => {
      const matchesSearch = 
        p.product?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "prediction":
          return b.prediction - a.prediction;
        case "confidence":
          return b.confidence - a.confidence;
        case "product":
          return a.product?.localeCompare(b.product);
        case "date":
        default:
          return new Date(b.date || 0) - new Date(a.date || 0);
      }
    });

  // Calculations
  const totalPredictedSales = predictions.reduce((sum, p) => sum + (Number(p.prediction) || 0), 0);
  const avgConfidence = predictions.length ? 
    Math.round(predictions.reduce((sum, p) => sum + (Number(p.confidence) || 0), 0) / predictions.length) : 0;
  
  const highConfidenceCount = predictions.filter(p => p.confidence >= 80).length;
  const mediumConfidenceCount = predictions.filter(p => p.confidence >= 60 && p.confidence < 80).length;
  const lowConfidenceCount = predictions.filter(p => p.confidence < 60).length;

  const categoryBreakdown = {};
  predictions.forEach(p => {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
  });

  const categories = ["Electronics", "Fashion", "Home", "Books", "Sports", "Other"];

  const exportData = () => {
    const headers = ["Product", "Category", "Price", "Quantity", "Season", "Marketing Budget", "Prediction", "Confidence", "Date"];
    const csvData = predictions.map(p => [
      p.product,
      p.category,
      p.price,
      p.quantity,
      p.season,
      p.marketingBudget,
      p.prediction,
      p.confidence + "%",
      new Date(p.date).toLocaleDateString()
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `predictions_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showNotification("📥 Data exported successfully", "success");
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "#10b981";
    if (confidence >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 80) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  return (
    <div className={`sales-prediction ${darkMode ? 'dark' : ''}`}>
      
      {/* Animated Background */}
      <div className="sp-bg-animation"></div>

      {/* Header */}
      <div className="sp-header">
        <div className="sp-header-left">
          <h1>
            <span className="sp-header-icon">🔮</span>
            Sales Prediction AI
          </h1>
          <p className="sp-header-stats">
            <span className="sp-badge">{predictions.length} Predictions</span>
            <span className="sp-badge sp-badge-primary">💰 ₹{totalPredictedSales.toLocaleString()} Projected</span>
          </p>
        </div>
        <div className="sp-header-actions">
          <button className="sp-btn sp-btn-icon" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="sp-btn sp-btn-success" onClick={exportData}>
            📥 Export
          </button>
          {selectedItems.length > 0 && (
            <button className="sp-btn sp-btn-danger" onClick={deleteSelected}>
              🗑️ Delete ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`sp-notification sp-notification-${notification.type}`}>
          <span className="sp-notification-icon">
            {notification.type === 'success' ? '✅' : 
             notification.type === 'error' ? '❌' : 
             notification.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          {notification.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="sp-stats-grid">
        <div className="sp-stat-card gradient-blue">
          <div className="sp-stat-icon">📊</div>
          <div className="sp-stat-content">
            <div className="sp-stat-label">Total Predictions</div>
            <div className="sp-stat-value">{predictions.length}</div>
            <div className="sp-stat-trend">Across all categories</div>
          </div>
        </div>
        <div className="sp-stat-card gradient-purple">
          <div className="sp-stat-icon">💰</div>
          <div className="sp-stat-content">
            <div className="sp-stat-label">Projected Revenue</div>
            <div className="sp-stat-value">₹{totalPredictedSales.toLocaleString()}</div>
            <div className="sp-stat-trend">Next quarter</div>
          </div>
        </div>
        <div className="sp-stat-card gradient-green">
          <div className="sp-stat-icon">🎯</div>
          <div className="sp-stat-content">
            <div className="sp-stat-label">Avg. Confidence</div>
            <div className="sp-stat-value">{avgConfidence}%</div>
            <div className="sp-stat-trend">Prediction accuracy</div>
          </div>
        </div>
        <div className="sp-stat-card gradient-orange">
          <div className="sp-stat-icon">🔥</div>
          <div className="sp-stat-content">
            <div className="sp-stat-label">High Confidence</div>
            <div className="sp-stat-value">{highConfidenceCount}</div>
            <div className="sp-stat-trend">80%+ accuracy</div>
          </div>
        </div>
      </div>

      {/* Confidence Distribution */}
      <div className="sp-confidence-bar">
        <div className="sp-confidence-segment high" style={{ width: `${(highConfidenceCount / Math.max(predictions.length, 1)) * 100}%` }}>
          <span>High: {highConfidenceCount}</span>
        </div>
        <div className="sp-confidence-segment medium" style={{ width: `${(mediumConfidenceCount / Math.max(predictions.length, 1)) * 100}%` }}>
          <span>Medium: {mediumConfidenceCount}</span>
        </div>
        <div className="sp-confidence-segment low" style={{ width: `${(lowConfidenceCount / Math.max(predictions.length, 1)) * 100}%` }}>
          <span>Low: {lowConfidenceCount}</span>
        </div>
      </div>

      {/* Prediction Form */}
      <div className="sp-form-card">
        <h2 className="sp-form-title">
          <span className="sp-form-icon">{editing ? '✏️' : '🤖'}</span>
          {editing ? 'Edit Prediction' : 'Generate New Prediction'}
        </h2>
        <form onSubmit={handleSubmit} className="sp-form">
          <div className="sp-form-row">
            <div className="sp-form-group">
              <label>📦 Product Name *</label>
              <input
                type="text"
                name="product"
                value={form.product}
                onChange={handleChange}
                placeholder="e.g., iPhone 15 Pro"
                className="sp-input"
                required
              />
            </div>
            <div className="sp-form-group">
              <label>🏷️ Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="sp-select">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="sp-form-row">
            <div className="sp-form-group">
              <label>💰 Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g., 999"
                min="0"
                className="sp-input"
                required
              />
            </div>
            <div className="sp-form-group">
              <label>📊 Expected Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g., 1000"
                min="1"
                className="sp-input"
                required
              />
            </div>
          </div>

          <div className="sp-form-row">
            <div className="sp-form-group">
              <label>🌤️ Season</label>
              <select name="season" value={form.season} onChange={handleChange} className="sp-select">
                <option value="Spring">🌸 Spring</option>
                <option value="Summer">☀️ Summer</option>
                <option value="Fall">🍂 Fall</option>
                <option value="Winter">❄️ Winter</option>
                <option value="Holiday">🎄 Holiday</option>
              </select>
            </div>
            <div className="sp-form-group">
              <label>📢 Marketing Budget (₹)</label>
              <input
                type="number"
                name="marketingBudget"
                value={form.marketingBudget}
                onChange={handleChange}
                placeholder="e.g., 50000"
                min="0"
                className="sp-input"
              />
            </div>
          </div>

          <div className="sp-form-row">
            <div className="sp-form-group">
              <label>🏪 Competitor Price</label>
              <input
                type="number"
                name="competitorPrice"
                value={form.competitorPrice}
                onChange={handleChange}
                placeholder="e.g., 949"
                min="0"
                className="sp-input"
              />
            </div>
            <div className="sp-form-group">
              <label>⭐ Customer Rating (1-5)</label>
              <input
                type="number"
                name="customerRating"
                value={form.customerRating}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.1"
                className="sp-input"
              />
            </div>
          </div>

          <div className="sp-form-group">
            <label>📈 Previous Sales (₹)</label>
            <input
              type="number"
              name="previousSales"
              value={form.previousSales}
              onChange={handleChange}
              placeholder="e.g., 500000"
              min="0"
              className="sp-input"
            />
          </div>

          {/* AI Prediction Button */}
          <div className="sp-ai-section">
            <button 
              type="button" 
              className={`sp-ai-predict-btn ${isPredicting ? 'predicting' : ''}`}
              onClick={generatePrediction}
              disabled={isPredicting}
            >
              {isPredicting ? (
                <>
                  <span className="sp-spinner"></span>
                  Analyzing Data...
                </>
              ) : (
                <>
                  <span className="sp-ai-icon">🤖</span>
                  Generate AI Prediction
                </>
              )}
            </button>

            {form.prediction && (
              <div className="sp-prediction-result">
                <div className="sp-result-header">
                  <span className="sp-result-label">Predicted Sales</span>
                  <span className="sp-result-confidence" style={{ color: getConfidenceColor(form.confidence) }}>
                    {form.confidence}% Confidence
                  </span>
                </div>
                <div className="sp-result-value">₹{form.prediction.toLocaleString()}</div>
                <div className="sp-result-bar">
                  <div 
                    className="sp-result-bar-fill" 
                    style={{ 
                      width: `${form.confidence}%`,
                      background: `linear-gradient(90deg, ${getConfidenceColor(form.confidence)}, ${getConfidenceColor(form.confidence)}dd)`
                    }}
                  ></div>
                </div>
                <div className="sp-result-badge" style={{ background: getConfidenceColor(form.confidence) }}>
                  {getConfidenceText(form.confidence)} Confidence
                </div>
              </div>
            )}
          </div>

          <div className="sp-form-actions">
            <button type="submit" className="sp-btn sp-btn-gradient" disabled={!form.prediction}>
              {editing ? '✏️ Update Prediction' : '💾 Save Prediction'}
            </button>
            {editing && (
              <button type="button" className="sp-btn sp-btn-secondary" onClick={resetForm}>
                ❌ Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="sp-filters-card">
        <div className="sp-search-group">
          <span className="sp-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sp-search-input"
          />
        </div>
        <div className="sp-filter-group">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="sp-select">
            <option value="All">📋 All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sp-select">
            <option value="date">📅 Newest</option>
            <option value="prediction">💰 Highest Sales</option>
            <option value="confidence">🎯 Highest Confidence</option>
            <option value="product">📦 Product Name</option>
          </select>
          <div className="sp-view-toggle">
            <button 
              className={`sp-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              📱 Grid
            </button>
            <button 
              className={`sp-view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="sp-grid">
          {filteredPredictions.length > 0 ? (
            filteredPredictions.map(p => (
              <div key={p.id} className="sp-prediction-card">
                <div className="sp-card-header">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="sp-checkbox"
                  />
                  <span className="sp-card-category">{p.category}</span>
                  <div className="sp-card-actions">
                    <button className="sp-card-btn edit" onClick={() => editPrediction(p)}>✏️</button>
                    <button className="sp-card-btn delete" onClick={() => deletePrediction(p.id)}>🗑️</button>
                  </div>
                </div>
                
                <div className="sp-card-body">
                  <h3 className="sp-card-title">{p.product}</h3>
                  
                  <div className="sp-card-details">
                    <div className="sp-detail-item">
                      <span>💰 Price</span>
                      <strong>₹{Number(p.price).toLocaleString()}</strong>
                    </div>
                    <div className="sp-detail-item">
                      <span>📊 Qty</span>
                      <strong>{Number(p.quantity).toLocaleString()}</strong>
                    </div>
                    <div className="sp-detail-item">
                      <span>🌤️ Season</span>
                      <strong>{p.season}</strong>
                    </div>
                  </div>

                  <div className="sp-card-prediction">
                    <div className="sp-prediction-header">
                      <span>Predicted Sales</span>
                      <span className="sp-confidence-badge" style={{ color: getConfidenceColor(p.confidence) }}>
                        {p.confidence}%
                      </span>
                    </div>
                    <div className="sp-prediction-value">₹{Number(p.prediction).toLocaleString()}</div>
                    <div className="sp-confidence-bar">
                      <div 
                        className="sp-confidence-fill" 
                        style={{ 
                          width: `${p.confidence}%`,
                          background: getConfidenceColor(p.confidence)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="sp-card-footer">
                  <span>📅 {new Date(p.date).toLocaleDateString()}</span>
                  <span className={`sp-confidence-tag ${getConfidenceText(p.confidence).toLowerCase()}`}>
                    {getConfidenceText(p.confidence)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="sp-empty-state">
              <span className="sp-empty-icon">🔮</span>
              <p>No predictions yet</p>
              {search && <button className="sp-btn sp-btn-link" onClick={() => setSearch('')}>Clear search</button>}
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="sp-table-wrapper">
          <table className="sp-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredPredictions.length && filteredPredictions.length > 0}
                    onChange={selectAll}
                    className="sp-checkbox"
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Season</th>
                <th>Prediction</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPredictions.map(p => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="sp-checkbox"
                    />
                  </td>
                  <td className="sp-product-name">{p.product}</td>
                  <td><span className="sp-category-tag">{p.category}</span></td>
                  <td>₹{Number(p.price).toLocaleString()}</td>
                  <td>{Number(p.quantity).toLocaleString()}</td>
                  <td>{p.season}</td>
                  <td className="sp-prediction-cell">₹{Number(p.prediction).toLocaleString()}</td>
                  <td>
                    <div className="sp-table-confidence">
                      <div 
                        className="sp-table-confidence-bar"
                        style={{ 
                          width: `${p.confidence}%`,
                          background: getConfidenceColor(p.confidence)
                        }}
                      ></div>
                      <span>{p.confidence}%</span>
                    </div>
                  </td>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>
                    <div className="sp-table-actions">
                      <button className="sp-table-btn edit" onClick={() => editPrediction(p)}>✏️</button>
                      <button className="sp-table-btn delete" onClick={() => deletePrediction(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Summary */}
      {predictions.length > 0 && (
        <div className="sp-footer">
          <div className="sp-footer-item">
            <span>📊 Total:</span>
            <strong>{predictions.length}</strong>
          </div>
          <div className="sp-footer-item">
            <span>💰 Projected:</span>
            <strong className="sp-text-success">₹{totalPredictedSales.toLocaleString()}</strong>
          </div>
          <div className="sp-footer-item">
            <span>🎯 Avg Confidence:</span>
            <strong className="sp-text-purple">{avgConfidence}%</strong>
          </div>
          <div className="sp-footer-item">
            <span>🔥 High Confidence:</span>
            <strong className="sp-text-green">{highConfidenceCount}</strong>
          </div>
        </div>
      )}
    </div>
  );
}