import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from "recharts";
import "./Billing.css";

export default function Billing() {
  // State management
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("crm_invoices");
    return saved ? JSON.parse(saved) : generateSampleInvoices();
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("crm_transactions");
    return saved ? JSON.parse(saved) : generateSampleTransactions();
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("crm_customers");
    return saved ? JSON.parse(saved) : generateSampleCustomers();
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("crm_products");
    return saved ? JSON.parse(saved) : generateSampleProducts();
  });

  // UI State
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [taxRate, setTaxRate] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [newInvoice, setNewInvoice] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: "draft",
    dueDate: "",
    notes: "",
    paymentMethod: "",
    paymentTerms: "net30"
  });

  const [newItem, setNewItem] = useState({
    productId: "",
    name: "",
    quantity: 1,
    price: 0,
    total: 0
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("crm_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("crm_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("crm_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("crm_products", JSON.stringify(products));
  }, [products]);

  // Sample data generators
  function generateSampleInvoices() {
    return [
      {
        id: "INV-001",
        customerId: "CUST-001",
        customerName: "Acme Corporation",
        customerEmail: "billing@acme.com",
        customerPhone: "+1 234-567-890",
        items: [
          { id: 1, name: "Product A", quantity: 2, price: 5000, total: 10000 },
          { id: 2, name: "Service B", quantity: 1, price: 3000, total: 3000 }
        ],
        subtotal: 13000,
        tax: 2340,
        discount: 0,
        total: 15340,
        status: "paid",
        date: "2026-03-15",
        dueDate: "2026-04-14",
        paymentMethod: "Credit Card",
        paymentTerms: "net30",
        notes: "Thank you for your business"
      },
      {
        id: "INV-002",
        customerId: "CUST-002",
        customerName: "TechStart Inc",
        customerEmail: "accounts@techstart.com",
        customerPhone: "+1 234-567-891",
        items: [
          { id: 3, name: "Software License", quantity: 5, price: 2000, total: 10000 },
          { id: 4, name: "Support Package", quantity: 1, price: 5000, total: 5000 }
        ],
        subtotal: 15000,
        tax: 2700,
        discount: 1000,
        total: 16700,
        status: "pending",
        date: "2026-03-14",
        dueDate: "2026-04-13",
        paymentMethod: "Bank Transfer",
        paymentTerms: "net30",
        notes: "Early payment discount applied"
      },
      {
        id: "INV-003",
        customerId: "CUST-003",
        customerName: "Global Solutions",
        customerEmail: "finance@global.com",
        customerPhone: "+1 234-567-892",
        items: [
          { id: 5, name: "Consulting Hours", quantity: 20, price: 1500, total: 30000 }
        ],
        subtotal: 30000,
        tax: 5400,
        discount: 0,
        total: 35400,
        status: "overdue",
        date: "2026-03-01",
        dueDate: "2026-03-31",
        paymentMethod: "Check",
        paymentTerms: "net30",
        notes: "Urgent: Payment overdue"
      },
      {
        id: "INV-004",
        customerId: "CUST-004",
        customerName: "Innovate Ltd",
        customerEmail: "payments@innovate.com",
        customerPhone: "+1 234-567-893",
        items: [
          { id: 6, name: "Hardware Package", quantity: 3, price: 8000, total: 24000 },
          { id: 7, name: "Installation", quantity: 1, price: 5000, total: 5000 }
        ],
        subtotal: 29000,
        tax: 5220,
        discount: 2000,
        total: 32220,
        status: "draft",
        date: "2026-03-16",
        dueDate: "2026-04-15",
        paymentMethod: "",
        paymentTerms: "net30",
        notes: "Draft - pending approval"
      }
    ];
  }

  function generateSampleTransactions() {
    return [
      { id: 1, invoiceId: "INV-001", amount: 15340, type: "payment", method: "Credit Card", date: "2026-03-15", status: "completed" },
      { id: 2, invoiceId: "INV-002", amount: 16700, type: "payment", method: "Bank Transfer", date: "2026-03-14", status: "pending" },
      { id: 3, invoiceId: "INV-003", amount: 35400, type: "payment", method: "Check", date: "2026-03-01", status: "failed" }
    ];
  }

  function generateSampleCustomers() {
    return [
      { id: "CUST-001", name: "Acme Corporation", email: "billing@acme.com", phone: "+1 234-567-890", address: "123 Business Ave", city: "New York", state: "NY", zip: "10001", country: "USA" },
      { id: "CUST-002", name: "TechStart Inc", email: "accounts@techstart.com", phone: "+1 234-567-891", address: "456 Tech Blvd", city: "San Francisco", state: "CA", zip: "94105", country: "USA" },
      { id: "CUST-003", name: "Global Solutions", email: "finance@global.com", phone: "+1 234-567-892", address: "789 Global Plaza", city: "London", state: "", zip: "EC1A 1BB", country: "UK" },
      { id: "CUST-004", name: "Innovate Ltd", email: "payments@innovate.com", phone: "+1 234-567-893", address: "321 Innovation Way", city: "Berlin", state: "", zip: "10115", country: "Germany" }
    ];
  }

  function generateSampleProducts() {
    return [
      { id: 1, name: "Product A", price: 5000, tax: 18, hsn: "1234", unit: "pcs" },
      { id: 2, name: "Service B", price: 3000, tax: 18, hsn: "5678", unit: "hrs" },
      { id: 3, name: "Software License", price: 2000, tax: 18, hsn: "9012", unit: "license" },
      { id: 4, name: "Support Package", price: 5000, tax: 18, hsn: "3456", unit: "month" },
      { id: 5, name: "Consulting Hours", price: 1500, tax: 18, hsn: "7890", unit: "hrs" },
      { id: 6, name: "Hardware Package", price: 8000, tax: 18, hsn: "2345", unit: "set" },
      { id: 7, name: "Installation", price: 5000, tax: 18, hsn: "6789", unit: "service" }
    ];
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = invoices.reduce((sum, inv) => 
      inv.status === "paid" ? sum + inv.total : sum, 0
    );
    
    const pendingAmount = invoices.reduce((sum, inv) => 
      inv.status === "pending" || inv.status === "overdue" ? sum + inv.total : sum, 0
    );
    
    const overdueAmount = invoices.reduce((sum, inv) => 
      inv.status === "overdue" ? sum + inv.total : sum, 0
    );
    
    const paidInvoices = invoices.filter(inv => inv.status === "paid").length;
    const pendingInvoices = invoices.filter(inv => inv.status === "pending").length;
    const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length;
    const draftInvoices = invoices.filter(inv => inv.status === "draft").length;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyRevenue = invoices
      .filter(inv => {
        const date = new Date(inv.date);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear && inv.status === "paid";
      })
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const lastMonthRevenue = invoices
      .filter(inv => {
        const date = new Date(inv.date);
        return date.getMonth() === thisMonth - 1 && date.getFullYear() === thisYear && inv.status === "paid";
      })
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const growth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;
    
    return {
      totalRevenue,
      pendingAmount,
      overdueAmount,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      draftInvoices,
      totalInvoices: invoices.length,
      monthlyRevenue,
      growth,
      avgInvoiceValue: invoices.length > 0 ? totalRevenue / invoices.length : 0
    };
  }, [invoices]);

  // Filter and sort invoices
  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.id.toLowerCase().includes(term) ||
        inv.customerName.toLowerCase().includes(term) ||
        inv.customerEmail?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(inv => {
        const invDate = new Date(inv.date);
        return invDate >= new Date(dateRange.start) && invDate <= new Date(dateRange.end);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "date":
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          break;
        case "dueDate":
          aVal = new Date(a.dueDate);
          bVal = new Date(b.dueDate);
          break;
        case "amount":
          aVal = a.total;
          bVal = b.total;
          break;
        case "customer":
          aVal = a.customerName;
          bVal = b.customerName;
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [invoices, searchTerm, filterStatus, dateRange, sortBy, sortOrder]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Chart data
  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const revenue = invoices
        .filter(inv => {
          const date = new Date(inv.date);
          return date.getMonth() === index && date.getFullYear() === currentYear && inv.status === "paid";
        })
        .reduce((sum, inv) => sum + inv.total, 0);
      
      return { month, revenue };
    });
  }, [invoices]);

  const statusData = [
    { name: "Paid", value: metrics.paidInvoices, color: "#2ecc71" },
    { name: "Pending", value: metrics.pendingInvoices, color: "#f39c12" },
    { name: "Overdue", value: metrics.overdueInvoices, color: "#e74c3c" },
    { name: "Draft", value: metrics.draftInvoices, color: "#95a5a6" }
  ];

  // Add invoice item
  const addInvoiceItem = () => {
    if (!newItem.name || !newItem.price) return;

    const item = {
      id: Date.now(),
      name: newItem.name,
      quantity: newItem.quantity || 1,
      price: parseFloat(newItem.price) || 0,
      total: (newItem.quantity || 1) * (parseFloat(newItem.price) || 0)
    };

    setNewInvoice(prev => {
      const items = [...prev.items, item];
      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax - discount;

      return {
        ...prev,
        items,
        subtotal,
        tax,
        total
      };
    });

    setNewItem({
      productId: "",
      name: "",
      quantity: 1,
      price: 0,
      total: 0
    });
  };

  // Remove invoice item
  const removeInvoiceItem = (itemId) => {
    setNewInvoice(prev => {
      const items = prev.items.filter(i => i.id !== itemId);
      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax - discount;

      return {
        ...prev,
        items,
        subtotal,
        tax,
        total
      };
    });
  };

  // Create invoice
  const createInvoice = () => {
    if (newInvoice.items.length === 0 || !newInvoice.customerId) {
      showNotification("Please add items and select a customer", "error");
      return;
    }

    const invoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...newInvoice,
      date: new Date().toISOString().split('T')[0],
      dueDate: newInvoice.dueDate || calculateDueDate(newInvoice.paymentTerms)
    };

    setInvoices([invoice, ...invoices]);
    setShowAddModal(false);
    resetNewInvoice();
    showNotification("Invoice created successfully");
  };

  // Calculate due date based on payment terms
  const calculateDueDate = (terms) => {
    const date = new Date();
    switch(terms) {
      case "net15": date.setDate(date.getDate() + 15); break;
      case "net30": date.setDate(date.getDate() + 30); break;
      case "net45": date.setDate(date.getDate() + 45); break;
      case "net60": date.setDate(date.getDate() + 60); break;
      default: date.setDate(date.getDate() + 30);
    }
    return date.toISOString().split('T')[0];
  };

  // Reset new invoice form
  const resetNewInvoice = () => {
    setNewInvoice({
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      status: "draft",
      dueDate: "",
      notes: "",
      paymentMethod: "",
      paymentTerms: "net30"
    });
    setDiscount(0);
    setTaxRate(18);
  };

  // Mark invoice as paid
  const markAsPaid = (invoice) => {
    if (window.confirm(`Mark invoice ${invoice.id} as paid?`)) {
      setInvoices(invoices.map(inv =>
        inv.id === invoice.id ? { ...inv, status: "paid" } : inv
      ));

      // Add transaction
      const transaction = {
        id: Date.now(),
        invoiceId: invoice.id,
        amount: invoice.total,
        type: "payment",
        method: invoice.paymentMethod || "Manual",
        date: new Date().toISOString().split('T')[0],
        status: "completed"
      };
      setTransactions([transaction, ...transactions]);

      showNotification("Invoice marked as paid");
    }
  };

  // Send invoice reminder
  const sendReminder = (invoice) => {
    showNotification(`Reminder sent to ${invoice.customerEmail}`);
  };

  // Download invoice as PDF
  const downloadPDF = (invoice) => {
    // In a real app, this would generate a PDF
    showNotification(`PDF download started for ${invoice.id}`);
  };

  // Print invoice
  const printInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Show notification
  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "paid": return "#2ecc71";
      case "pending": return "#f39c12";
      case "overdue": return "#e74c3c";
      case "draft": return "#95a5a6";
      default: return "#95a5a6";
    }
  };

  return (
    <div className="billing-container">
      
      {/* Header */}
      <div className="billing-header">
        <div className="header-left">
          <h1>
            <span className="header-icon">💰</span>
            Billing & Invoicing
          </h1>
          <p className="header-subtitle">Manage invoices, payments, and revenue</p>
        </div>

        <div className="header-actions">
          <select
            className="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="INR">🇮🇳 INR</option>
            <option value="USD">🇺🇸 USD</option>
            <option value="EUR">🇪🇺 EUR</option>
            <option value="GBP">🇬🇧 GBP</option>
          </select>

          <button 
            className="create-btn"
            onClick={() => setShowAddModal(true)}
          >
            + New Invoice
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">{formatCurrency(metrics.totalRevenue)}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{formatCurrency(metrics.pendingAmount)}</span>
          </div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <span className="stat-label">Overdue</span>
            <span className="stat-value">{formatCurrency(metrics.overdueAmount)}</span>
          </div>
        </div>

        <div className="stat-card monthly">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Monthly Revenue</span>
            <span className="stat-value">{formatCurrency(metrics.monthlyRevenue)}</span>
          </div>
        </div>

        <div className="stat-card growth">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Growth</span>
            <span className={`stat-value ${metrics.growth >= 0 ? 'positive' : 'negative'}`}>
              {metrics.growth >= 0 ? '+' : ''}{metrics.growth}%
            </span>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <span className="stat-label">Avg Invoice</span>
            <span className="stat-value">{formatCurrency(metrics.avgInvoiceValue)}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="billing-tabs">
        <button
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          📄 Invoices ({metrics.totalInvoices})
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          💳 Transactions ({transactions.length})
        </button>
        <button
          className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Customers ({customers.length})
        </button>
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products ({products.length})
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      {/* Search and Filters */}
      {activeTab === 'invoices' && (
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search by invoice #, customer..."
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
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="draft">Draft</option>
            </select>

            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          <div className="date-range">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              placeholder="Start Date"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              placeholder="End Date"
            />
            {(dateRange.start || dateRange.end) && (
              <button className="clear-dates" onClick={() => setDateRange({start: "", end: ""})}>
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Info */}
      {activeTab === 'invoices' && (
        <div className="results-info">
          <span>Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredInvoices.length)} of {filteredInvoices.length} invoices</span>
          <span className="total-amount">Total: {formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.total, 0))}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="billing-content">
        
        {/* Invoices Table */}
        {activeTab === 'invoices' && (
          <div className="table-responsive">
            <table className="invoices-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td className="invoice-id">{invoice.id}</td>
                      <td>
                        <div className="customer-info">
                          <span className="customer-name">{invoice.customerName}</span>
                          <small className="customer-email">{invoice.customerEmail}</small>
                        </div>
                      </td>
                      <td>{invoice.date}</td>
                      <td className={new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? 'overdue-date' : ''}>
                        {invoice.dueDate}
                      </td>
                      <td className="amount">{formatCurrency(invoice.total)}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        {invoice.paymentMethod || '-'}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowInvoiceModal(true);
                            }}
                            title="View"
                          >
                            👁️
                          </button>
                          {invoice.status !== 'paid' && (
                            <button 
                              className="action-btn paid"
                              onClick={() => markAsPaid(invoice)}
                              title="Mark as Paid"
                            >
                              ✅
                            </button>
                          )}
                          <button 
                            className="action-btn reminder"
                            onClick={() => sendReminder(invoice)}
                            title="Send Reminder"
                          >
                            📧
                          </button>
                          <button 
                            className="action-btn download"
                            onClick={() => downloadPDF(invoice)}
                            title="Download PDF"
                          >
                            📥
                          </button>
                          <button 
                            className="action-btn print"
                            onClick={() => printInvoice(invoice)}
                            title="Print"
                          >
                            🖨️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
                      <div className="no-results-content">
                        <span className="no-results-icon">📭</span>
                        <h3>No invoices found</h3>
                        <p>Try adjusting your filters or create a new invoice</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="transactions-view">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice #</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.invoiceId}</td>
                    <td>{formatCurrency(transaction.amount)}</td>
                    <td>{transaction.method}</td>
                    <td>
                      <span className={`status-badge ${transaction.status}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="customers-view">
            <div className="customers-grid">
              {customers.map(customer => (
                <div key={customer.id} className="customer-card">
                  <div className="customer-avatar">
                    {customer.name.charAt(0)}
                  </div>
                  <h3>{customer.name}</h3>
                  <p className="customer-email">{customer.email}</p>
                  <p className="customer-phone">{customer.phone}</p>
                  <p className="customer-address">{customer.city}, {customer.country}</p>
                  <div className="customer-stats">
                    <div className="stat">
                      <span className="stat-label">Invoices</span>
                      <span className="stat-number">
                        {invoices.filter(inv => inv.customerId === customer.id).length}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Total</span>
                      <span className="stat-number">
                        {formatCurrency(invoices
                          .filter(inv => inv.customerId === customer.id && inv.status === 'paid')
                          .reduce((sum, inv) => sum + inv.total, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-view">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Tax %</th>
                  <th>HSN Code</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.tax}%</td>
                    <td>{product.hsn}</td>
                    <td>{product.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-view">
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#667eea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#764ba2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Invoice Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData.filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Cumulative Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="revenue" stroke="#2ecc71" fill="#2ecc7180" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'invoices' && filteredInvoices.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Invoice</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <div className="invoice-form">
              {/* Customer Selection */}
              <div className="form-section">
                <h3>Customer Details</h3>
                <select
                  className="form-select"
                  value={newInvoice.customerId}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setNewInvoice({
                      ...newInvoice,
                      customerId: customer?.id || "",
                      customerName: customer?.name || "",
                      customerEmail: customer?.email || "",
                      customerPhone: customer?.phone || ""
                    });
                  }}
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                    </option>
                  ))}
                </select>

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={newInvoice.customerName}
                    onChange={(e) => setNewInvoice({...newInvoice, customerName: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newInvoice.customerEmail}
                    onChange={(e) => setNewInvoice({...newInvoice, customerEmail: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newInvoice.customerPhone}
                    onChange={(e) => setNewInvoice({...newInvoice, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="form-section">
                <h3>Invoice Items</h3>
                
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {newInvoice.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{formatCurrency(item.total)}</td>
                          <td>
                            <button 
                              className="remove-item"
                              onClick={() => removeInvoiceItem(item.id)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="add-item-row">
                  <select
                    value={newItem.productId}
                    onChange={(e) => {
                      const product = products.find(p => p.id.toString() === e.target.value);
                      setNewItem({
                        ...newItem,
                        productId: e.target.value,
                        name: product?.name || "",
                        price: product?.price || 0
                      });
                    }}
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {formatCurrency(product.price)}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                  />
                  <button className="add-item-btn" onClick={addInvoiceItem}>
                    Add Item
                  </button>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="form-section">
                <h3>Invoice Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <select
                      value={newInvoice.paymentTerms}
                      onChange={(e) => setNewInvoice({...newInvoice, paymentTerms: e.target.value})}
                    >
                      <option value="net15">Net 15</option>
                      <option value="net30">Net 30</option>
                      <option value="net45">Net 45</option>
                      <option value="net60">Net 60</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 0;
                        setTaxRate(rate);
                        setNewInvoice(prev => ({
                          ...prev,
                          tax: prev.subtotal * (rate / 100),
                          total: prev.subtotal + (prev.subtotal * (rate / 100)) - prev.discount
                        }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => {
                        const disc = parseFloat(e.target.value) || 0;
                        setDiscount(disc);
                        setNewInvoice(prev => ({
                          ...prev,
                          discount: disc,
                          total: prev.subtotal + prev.tax - disc
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows="3"
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(newInvoice.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax ({taxRate}%):</span>
                  <span>{formatCurrency(newInvoice.tax)}</span>
                </div>
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(newInvoice.discount)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatCurrency(newInvoice.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button className="save-btn" onClick={createInvoice}>
                  Create Invoice
                </button>
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="modal" onClick={() => setShowInvoiceModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="invoice-view" id="invoice-print">
              <div className="invoice-header">
                <div className="company-info">
                  <h2>COMPANY NAME</h2>
                  <p>123 Business Street</p>
                  <p>City, State 12345</p>
                  <p>contact@company.com</p>
                  <p>+1 234-567-890</p>
                </div>
                <div className="invoice-info">
                  <h1>INVOICE</h1>
                  <p><strong>Invoice #:</strong> {selectedInvoice.id}</p>
                  <p><strong>Date:</strong> {selectedInvoice.date}</p>
                  <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge`} style={{backgroundColor: getStatusColor(selectedInvoice.status)}}>
                      {selectedInvoice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="customer-section">
                <h3>Bill To:</h3>
                <p><strong>{selectedInvoice.customerName}</strong></p>
                <p>{selectedInvoice.customerEmail}</p>
                <p>{selectedInvoice.customerPhone}</p>
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="invoice-totals">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                </div>
                <div className="totals-row">
                  <span>Tax:</span>
                  <span>{formatCurrency(selectedInvoice.tax)}</span>
                </div>
                <div className="totals-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(selectedInvoice.discount)}</span>
                </div>
                <div className="totals-row grand-total">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedInvoice.total)}</span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="invoice-notes">
                  <h4>Notes:</h4>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}

              <div className="invoice-footer">
                <p>Thank you for your business!</p>
                <p className="payment-terms">Payment Terms: {selectedInvoice.paymentTerms}</p>
              </div>
            </div>

            <div className="invoice-actions">
              <button className="print-btn" onClick={() => window.print()}>
                🖨️ Print
              </button>
              <button className="download-btn" onClick={() => downloadPDF(selectedInvoice)}>
                📥 Download PDF
              </button>
              <button className="close-btn" onClick={() => setShowInvoiceModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notif => (
          <div key={notif.id} className={`notification ${notif.type}`}>
            {notif.type === 'success' ? '✅' : '❌'} {notif.message}
          </div>
        ))}
      </div>
    </div>
  );
}