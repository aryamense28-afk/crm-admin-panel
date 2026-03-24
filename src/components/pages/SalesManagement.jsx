import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Scatter
} from "recharts";
import "./SalesManagement.css";

const SalesManagement = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState("Q3");

  // ==================== OVERVIEW DATA ====================
  const overviewData = {
    kpis: [
      { id: 1, title: "Total Revenue", value: "₹12.45L", change: "+15.3%", icon: "💰", color: "#6366f1" },
      { id: 2, title: "Active Deals", value: "89", change: "+8", icon: "📊", color: "#10b981" },
      { id: 3, title: "Conversion Rate", value: "64.5%", change: "+5.2%", icon: "🎯", color: "#f59e0b" },
      { id: 4, title: "Avg Deal Size", value: "₹1.4L", change: "+12%", icon: "📈", color: "#ef4444" }
    ],
    monthlyRevenue: [
      { month: "Jan", revenue: 145000, target: 150000, deals: 12 },
      { month: "Feb", revenue: 132000, target: 150000, deals: 10 },
      { month: "Mar", revenue: 168000, target: 160000, deals: 15 },
      { month: "Apr", revenue: 155000, target: 160000, deals: 14 },
      { month: "May", revenue: 189000, target: 170000, deals: 18 },
      { month: "Jun", revenue: 210000, target: 180000, deals: 20 },
      { month: "Jul", revenue: 198000, target: 180000, deals: 19 },
      { month: "Aug", revenue: 225000, target: 190000, deals: 22 }
    ],
    topProducts: [
      { name: "Enterprise CRM", revenue: 675000, sales: 45, growth: 25 },
      { name: "Pro Suite", revenue: 456000, sales: 38, growth: 18 },
      { name: "Basic License", revenue: 248000, sales: 62, growth: 12 },
      { name: "Add-ons", revenue: 84000, sales: 28, growth: 8 }
    ]
  };

  // ==================== PIPELINE DATA ====================
  const [pipelineData, setPipelineData] = useState({
    stages: [
      { id: 1, name: "Lead", count: 45, value: 450000, color: "#94a3b8" },
      { id: 2, name: "Contacted", count: 38, value: 570000, color: "#60a5fa" },
      { id: 3, name: "Qualified", count: 32, value: 640000, color: "#34d399" },
      { id: 4, name: "Proposal", count: 25, value: 625000, color: "#fbbf24" },
      { id: 5, name: "Negotiation", count: 18, value: 540000, color: "#f97316" },
      { id: 6, name: "Closed Won", count: 89, value: 1245000, color: "#10b981" }
    ],
    deals: [
      { id: 1, name: "Tech Corp Enterprise", company: "Tech Corp", value: 250000, stage: "Negotiation", probability: 85, owner: "John Smith", closeDate: "2024-03-30" },
      { id: 2, name: "Infosys CRM Upgrade", company: "Infosys", value: 180000, stage: "Proposal", probability: 70, owner: "Sarah Johnson", closeDate: "2024-04-15" },
      { id: 3, name: "Wipro Deal", company: "Wipro", value: 320000, stage: "Qualified", probability: 60, owner: "Mike Wilson", closeDate: "2024-05-01" },
      { id: 4, name: "HCL License Renewal", company: "HCL", value: 95000, stage: "Contacted", probability: 40, owner: "Emily Brown", closeDate: "2024-03-25" },
      { id: 5, name: "TCS Partnership", company: "TCS", value: 450000, stage: "Lead", probability: 25, owner: "David Lee", closeDate: "2024-06-10" }
    ]
  });

  // ==================== FORECAST DATA ====================
  const [forecastData, setForecastData] = useState({
    quarters: [
      { quarter: "Q1 2024", revenue: 445000, target: 450000, probability: 92, deals: 38 },
      { quarter: "Q2 2024", revenue: 552000, target: 500000, probability: 88, deals: 45 },
      { quarter: "Q3 2024", revenue: 633000, target: 600000, probability: 85, deals: 52 },
      { quarter: "Q4 2024", revenue: 698000, target: 650000, probability: 82, deals: 48 }
    ],
    monthlyForecast: [
      { month: "Sep", predicted: 235000, bestCase: 260000, worstCase: 210000, confidence: 92 },
      { month: "Oct", predicted: 248000, bestCase: 275000, worstCase: 220000, confidence: 88 },
      { month: "Nov", predicted: 262000, bestCase: 290000, worstCase: 235000, confidence: 85 },
      { month: "Dec", predicted: 290000, bestCase: 320000, worstCase: 260000, confidence: 82 }
    ],
    predictions: {
      q3: { predicted: 695000, best: 750000, worst: 620000, confidence: 89 },
      q4: { predicted: 800000, best: 880000, worst: 720000, confidence: 85 },
      nextYear: { predicted: 3200000, best: 3500000, worst: 2900000, confidence: 78 }
    }
  });

  // ==================== PREDICTIONS DATA ====================
  const [predictionModel, setPredictionModel] = useState({
    features: [
      { name: "Company Size", weight: 0.25, value: 75 },
      { name: "Industry Fit", weight: 0.20, value: 82 },
      { name: "Budget", weight: 0.30, value: 68 },
      { name: "Timeline", weight: 0.15, value: 90 },
      { name: "Competition", weight: 0.10, value: 45 }
    ],
    recentPredictions: [
      { id: 1, company: "Tech Corp", probability: 92, value: 250000, recommendation: "High Priority - Close this quarter" },
      { id: 2, company: "Infosys", probability: 78, value: 180000, recommendation: "Schedule demo this week" },
      { id: 3, company: "Wipro", probability: 65, value: 320000, recommendation: "Technical evaluation needed" },
      { id: 4, company: "HCL", probability: 45, value: 95000, recommendation: "Nurture - Follow up in 2 weeks" }
    ]
  });

  const [dealInput, setDealInput] = useState({
    companySize: "",
    industry: "technology",
    dealValue: "",
    leadSource: "website",
    timeline: "3months",
    budget: ""
  });
  const [predictionResult, setPredictionResult] = useState(null);

  const predictDeal = () => {
    setLoading(true);
    setTimeout(() => {
      const probability = Math.floor(Math.random() * 40) + 60;
      const value = parseInt(dealInput.dealValue) || 100000;
      const expectedValue = Math.round(value * probability / 100);
      
      const recommendations = [
        "Schedule executive meeting within 48 hours",
        "Prepare custom proposal with ROI analysis",
        "Involve technical team for deep dive",
        "Offer 15% discount for annual commitment",
        "Share relevant case studies"
      ];

      setPredictionResult({
        probability,
        expectedValue,
        confidence: Math.floor(Math.random() * 15) + 80,
        recommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
        nextSteps: probability > 80 ? "Immediate follow-up required" : "Nurture campaign recommended",
        timeline: probability > 80 ? "1-2 weeks" : "3-4 weeks",
        riskFactors: probability < 70 ? ["Budget concerns", "Strong competition"] : ["None identified"]
      });
      setLoading(false);
    }, 2000);
  };

  // ==================== CHATBOT DATA ====================
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your Sales AI Assistant. I can help you with:", sender: "bot", options: true },
    { id: 2, text: "• Pipeline analysis\n• Forecast predictions\n• Deal insights\n• Performance metrics\n• Sales recommendations", sender: "bot" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const salesChatbot = {
    responses: {
      pipeline: "Current pipeline has ₹24.5L in active deals with 18 in negotiation stage. Q3 target is at 92%.",
      forecast: "Q3 forecast: ₹6.95L (89% confidence). Top performing rep: Sarah with ₹4.2L this quarter.",
      prediction: "Deal #1234 with Tech Corp has 92% probability. Key factors: strong fit, budget approved.",
      performance: "Team performance: 89 deals closed (↑12%). John leads with 24 deals this quarter.",
      recommendation: "Focus on healthcare sector - conversion rate 25% higher than average."
    }
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { id: Date.now(), text: chatInput, sender: "user" }]);
    setChatInput("");
    setChatLoading(true);

    setTimeout(() => {
      let response = "I'll analyze that for you. ";
      const lowerInput = chatInput.toLowerCase();
      
      if (lowerInput.includes("pipeline")) response += salesChatbot.responses.pipeline;
      else if (lowerInput.includes("forecast")) response += salesChatbot.responses.forecast;
      else if (lowerInput.includes("predict")) response += salesChatbot.responses.prediction;
      else if (lowerInput.includes("perform")) response += salesChatbot.responses.performance;
      else if (lowerInput.includes("recommend")) response += salesChatbot.responses.recommendation;
      else response += "I can help with pipeline analysis, forecasts, predictions, and performance metrics. What would you like to know?";

      setChatMessages(prev => [...prev, { id: Date.now(), text: response, sender: "bot" }]);
      setChatLoading(false);
    }, 1500);
  };

  const quickActions = [
    { icon: "📊", label: "Pipeline Summary", action: () => setChatInput("Show pipeline summary") },
    { icon: "📈", label: "Q3 Forecast", action: () => setChatInput("What's the Q3 forecast?") },
    { icon: "🎯", label: "Top Deals", action: () => setChatInput("Show top 5 deals") },
    { icon: "👥", label: "Team Performance", action: () => setChatInput("Team performance this quarter") }
  ];

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="sales-management-pro">
      {/* Header */}
      <div className="sales-header-pro">
        <div>
          <h1>📊 Sales Intelligence Platform</h1>
          <p>Advanced analytics, predictions & AI-powered insights</p>
        </div>
        <div className="header-controls">
          <div className="date-range-pro">
            <button className={dateRange === "week" ? "active" : ""} onClick={() => setDateRange("week")}>Week</button>
            <button className={dateRange === "month" ? "active" : ""} onClick={() => setDateRange("month")}>Month</button>
            <button className={dateRange === "quarter" ? "active" : ""} onClick={() => setDateRange("quarter")}>Quarter</button>
            <button className={dateRange === "year" ? "active" : ""} onClick={() => setDateRange("year")}>Year</button>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="module-nav">
        <button className={activeModule === "overview" ? "active" : ""} onClick={() => setActiveModule("overview")}>
          <span>📊</span> Overview
        </button>
        <button className={activeModule === "pipeline" ? "active" : ""} onClick={() => setActiveModule("pipeline")}>
          <span>🔄</span> Pipeline
        </button>
        <button className={activeModule === "forecast" ? "active" : ""} onClick={() => setActiveModule("forecast")}>
          <span>🔮</span> Forecast
        </button>
        <button className={activeModule === "predictions" ? "active" : ""} onClick={() => setActiveModule("predictions")}>
          <span>🤖</span> Predictions
        </button>
        <button className={activeModule === "chatbot" ? "active" : ""} onClick={() => setActiveModule("chatbot")}>
          <span>💬</span> AI Chatbot
        </button>
      </div>

      {/* ==================== OVERVIEW MODULE ==================== */}
      {activeModule === "overview" && (
        <div className="module-overview">
          <div className="kpi-grid-pro">
            {overviewData.kpis.map(kpi => (
              <div key={kpi.id} className="kpi-card-pro" style={{ borderLeftColor: kpi.color }}>
                <div className="kpi-icon" style={{ background: `${kpi.color}20`, color: kpi.color }}>{kpi.icon}</div>
                <div className="kpi-content">
                  <span className="kpi-label">{kpi.title}</span>
                  <span className="kpi-value">{kpi.value}</span>
                  <span className="kpi-change">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="charts-grid">
            <div className="chart-card-pro">
              <h3>Revenue vs Target</h3>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={overviewData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4,4,0,0]} />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card-pro">
              <h3>Product Performance</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={overviewData.topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="revenue"
                    label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`}
                  >
                    {overviewData.topProducts.map((entry,index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PIPELINE MODULE ==================== */}
      {activeModule === "pipeline" && (
        <div className="module-pipeline">
          <div className="pipeline-stages-pro">
            {pipelineData.stages.map(stage => (
              <div key={stage.id} className="pipeline-stage-pro">
                <div className="stage-header" style={{ background: stage.color }}>
                  <h4>{stage.name}</h4>
                  <span>{stage.count}</span>
                </div>
                <div className="stage-value">₹{(stage.value/100000).toFixed(1)}L</div>
                <div className="stage-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(stage.value/1245000)*100}%`, background: stage.color }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pipeline-table-container">
            <h3>Active Deals</h3>
            <table className="pipeline-table">
              <thead>
                <tr>
                  <th>Deal Name</th>
                  <th>Company</th>
                  <th>Value</th>
                  <th>Stage</th>
                  <th>Probability</th>
                  <th>Owner</th>
                  <th>Close Date</th>
                </tr>
              </thead>
              <tbody>
                {pipelineData.deals.map(deal => (
                  <tr key={deal.id}>
                    <td className="deal-name">{deal.name}</td>
                    <td>{deal.company}</td>
                    <td className="deal-value">₹{(deal.value/100000).toFixed(1)}L</td>
                    <td>
                      <span className="stage-badge" style={{ background: pipelineData.stages.find(s => s.name === deal.stage)?.color + "20", color: pipelineData.stages.find(s => s.name === deal.stage)?.color }}>
                        {deal.stage}
                      </span>
                    </td>
                    <td>
                      <div className="probability-bar">
                        <div className="prob-fill" style={{ width: `${deal.probability}%` }}>{deal.probability}%</div>
                      </div>
                    </td>
                    <td>{deal.owner}</td>
                    <td>{deal.closeDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== FORECAST MODULE ==================== */}
      {activeModule === "forecast" && (
        <div className="module-forecast">
          <div className="forecast-header">
            <h2>Quarterly Forecast</h2>
            <div className="quarter-selector">
              {["Q1", "Q2", "Q3", "Q4"].map(q => (
                <button key={q} className={selectedQuarter === q ? "active" : ""} onClick={() => setSelectedQuarter(q)}>{q}</button>
              ))}
            </div>
          </div>

          <div className="forecast-grid">
            {Object.entries(forecastData.predictions).map(([key, value]) => (
              <div key={key} className="forecast-card">
                <h4>{key === "q3" ? "Q3 2024" : key === "q4" ? "Q4 2024" : "FY 2025"}</h4>
                <div className="forecast-values">
                  <div className="forecast-item">
                    <span>Best Case</span>
                    <span className="best">₹{(value.best/100000).toFixed(1)}L</span>
                  </div>
                  <div className="forecast-item">
                    <span>Predicted</span>
                    <span className="predicted">₹{(value.predicted/100000).toFixed(1)}L</span>
                  </div>
                  <div className="forecast-item">
                    <span>Worst Case</span>
                    <span className="worst">₹{(value.worst/100000).toFixed(1)}L</span>
                  </div>
                </div>
                <div className="forecast-confidence">
                  <div className="confidence-label">
                    <span>Confidence</span>
                    <span>{value.confidence}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${value.confidence}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-card-pro">
            <h3>Monthly Forecast with Confidence Intervals</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={forecastData.monthlyForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="bestCase" fill="#10b98120" stroke="#10b981" />
                <Area type="monotone" dataKey="worstCase" fill="#ef444420" stroke="#ef4444" />
                <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ==================== PREDICTIONS MODULE ==================== */}
      {activeModule === "predictions" && (
        <div className="module-predictions">
          <div className="prediction-grid">
            <div className="prediction-input-card">
              <h3>AI Deal Predictor</h3>
              <p>Enter deal details for AI-powered analysis</p>
              
              <div className="input-group">
                <label>Company Size</label>
                <select value={dealInput.companySize} onChange={(e) => setDealInput({...dealInput, companySize: e.target.value})}>
                  <option value="">Select size</option>
                  <option value="small">1-50 employees</option>
                  <option value="medium">51-200 employees</option>
                  <option value="large">201-1000 employees</option>
                  <option value="enterprise">1000+ employees</option>
                </select>
              </div>

              <div className="input-group">
                <label>Industry</label>
                <select value={dealInput.industry} onChange={(e) => setDealInput({...dealInput, industry: e.target.value})}>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                </select>
              </div>

              <div className="input-group">
                <label>Deal Value (₹)</label>
                <input type="number" placeholder="Enter amount" value={dealInput.dealValue} onChange={(e) => setDealInput({...dealInput, dealValue: e.target.value})} />
              </div>

              <div className="input-group">
                <label>Lead Source</label>
                <select value={dealInput.leadSource} onChange={(e) => setDealInput({...dealInput, leadSource: e.target.value})}>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="campaign">Campaign</option>
                  <option value="event">Event</option>
                  <option value="outbound">Outbound</option>
                </select>
              </div>

              <div className="input-group">
                <label>Expected Timeline</label>
                <select value={dealInput.timeline} onChange={(e) => setDealInput({...dealInput, timeline: e.target.value})}>
                  <option value="1month">Within 1 month</option>
                  <option value="3months">1-3 months</option>
                  <option value="6months">3-6 months</option>
                  <option value="year">6+ months</option>
                </select>
              </div>

              <button className="predict-btn" onClick={predictDeal} disabled={loading}>
                {loading ? "Analyzing..." : "Predict Deal Outcome"}
              </button>
            </div>

            {predictionResult && (
              <div className="prediction-result-card">
                <h3>Prediction Results</h3>
                
                <div className="result-meter">
                  <div className="meter-label">
                    <span>Success Probability</span>
                    <span className="probability-value">{predictionResult.probability}%</span>
                  </div>
                  <div className="meter-bar">
                    <div className="meter-fill" style={{ width: `${predictionResult.probability}%` }}></div>
                  </div>
                </div>

                <div className="result-stats">
                  <div className="stat">
                    <span className="stat-label">Expected Value</span>
                    <span className="stat-value">₹{predictionResult.expectedValue.toLocaleString()}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Confidence</span>
                    <span className="stat-value">{predictionResult.confidence}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Timeline</span>
                    <span className="stat-value">{predictionResult.timeline}</span>
                  </div>
                </div>

                <div className="result-recommendation">
                  <h4>AI Recommendation</h4>
                  <p>{predictionResult.recommendation}</p>
                </div>

                <div className="result-next-steps">
                  <h4>Next Steps</h4>
                  <p>{predictionResult.nextSteps}</p>
                </div>

                {predictionResult.riskFactors && (
                  <div className="result-risks">
                    <h4>Risk Factors</h4>
                    <ul>
                      {predictionResult.riskFactors.map((risk, i) => (
                        <li key={i}>⚠️ {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="recent-predictions">
              <h3>Recent Predictions</h3>
              {predictionModel.recentPredictions.map(pred => (
                <div key={pred.id} className="prediction-item">
                  <div className="pred-company">
                    <span className="company-name">{pred.company}</span>
                    <span className="company-value">₹{(pred.value/100000).toFixed(1)}L</span>
                  </div>
                  <div className="pred-probability">
                    <div className="prob-bar">
                      <div className="prob-fill" style={{ width: `${pred.probability}%` }}></div>
                    </div>
                    <span className="prob-value">{pred.probability}%</span>
                  </div>
                  <p className="pred-recommendation">{pred.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== CHATBOT MODULE ==================== */}
      {activeModule === "chatbot" && (
        <div className="module-chatbot">
          <div className="chat-container-pro">
            <div className="chat-sidebar">
              <h3>Quick Actions</h3>
              {quickActions.map((action, i) => (
                <button key={i} className="quick-action" onClick={action.action}>
                  <span>{action.icon}</span> {action.label}
                </button>
              ))}
              <div className="chat-stats">
                <h4>Sales Stats</h4>
                <div className="stat-item">
                  <span>Active Deals</span>
                  <strong>89</strong>
                </div>
                <div className="stat-item">
                  <span>This Month</span>
                  <strong>₹2.1L</strong>
                </div>
                <div className="stat-item">
                  <span>Conversion</span>
                  <strong>64.5%</strong>
                </div>
              </div>
            </div>

            <div className="chat-main">
              <div className="chat-messages-pro">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`message-pro ${msg.sender}`}>
                    <div className="message-avatar">
                      {msg.sender === "bot" ? "🤖" : "👤"}
                    </div>
                    <div className="message-content-pro">
                      {msg.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="message-pro bot">
                    <div className="message-avatar">🤖</div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-pro">
                <input
                  type="text"
                  placeholder="Ask about pipeline, forecasts, predictions..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <button onClick={sendChatMessage} disabled={chatLoading}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;