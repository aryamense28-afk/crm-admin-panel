import React, { useState, useEffect, useMemo } from "react";
import "./Orders.css";

export default function Orders() {
  // State management
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("crm_orders");
    return saved ? JSON.parse(saved) : generateSampleOrders();
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [newOrder, setNewOrder] = useState({
    orderNo: "",
    customerId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: "",
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: "",
    shippingAddress: "",
    billingAddress: "",
    notes: "",
    trackingNumber: "",
    courier: ""
  });

  const [newItem, setNewItem] = useState({
    productId: "",
    name: "",
    sku: "",
    quantity: 1,
    price: 0,
    total: 0
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("crm_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("crm_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("crm_products", JSON.stringify(products));
  }, [products]);

  // Sample data generators
  function generateSampleOrders() {
    return [
      {
        id: "ORD-001",
        orderNo: "ORD-2026-001",
        customerId: "CUST-001",
        customerName: "Acme Corporation",
        customerEmail: "billing@acme.com",
        customerPhone: "+1 234-567-890",
        customerAddress: "123 Business Ave, New York, NY 10001",
        items: [
          { id: 1, name: "Product A", sku: "SKU001", quantity: 2, price: 5000, total: 10000 },
          { id: 2, name: "Service B", sku: "SKU002", quantity: 1, price: 3000, total: 3000 }
        ],
        subtotal: 13000,
        tax: 2340,
        discount: 0,
        shipping: 500,
        total: 15840,
        status: "delivered",
        paymentStatus: "paid",
        paymentMethod: "Credit Card",
        orderDate: "2026-03-15",
        deliveryDate: "2026-03-18",
        shippingAddress: "123 Business Ave, New York, NY 10001",
        billingAddress: "123 Business Ave, New York, NY 10001",
        notes: "Handle with care",
        trackingNumber: "TRK123456789",
        courier: "FedEx"
      },
      {
        id: "ORD-002",
        orderNo: "ORD-2026-002",
        customerId: "CUST-002",
        customerName: "TechStart Inc",
        customerEmail: "orders@techstart.com",
        customerPhone: "+1 234-567-891",
        customerAddress: "456 Tech Blvd, San Francisco, CA 94105",
        items: [
          { id: 3, name: "Software License", sku: "SKU003", quantity: 5, price: 2000, total: 10000 },
          { id: 4, name: "Support Package", sku: "SKU004", quantity: 1, price: 5000, total: 5000 }
        ],
        subtotal: 15000,
        tax: 2700,
        discount: 1000,
        shipping: 0,
        total: 16700,
        status: "processing",
        paymentStatus: "pending",
        paymentMethod: "Bank Transfer",
        orderDate: "2026-03-14",
        deliveryDate: "",
        shippingAddress: "456 Tech Blvd, San Francisco, CA 94105",
        billingAddress: "456 Tech Blvd, San Francisco, CA 94105",
        notes: "Digital delivery only",
        trackingNumber: "",
        courier: ""
      },
      {
        id: "ORD-003",
        orderNo: "ORD-2026-003",
        customerId: "CUST-003",
        customerName: "Global Solutions",
        customerEmail: "purchasing@global.com",
        customerPhone: "+1 234-567-892",
        customerAddress: "789 Global Plaza, London, EC1A 1BB",
        items: [
          { id: 5, name: "Consulting Hours", sku: "SKU005", quantity: 20, price: 1500, total: 30000 }
        ],
        subtotal: 30000,
        tax: 5400,
        discount: 0,
        shipping: 0,
        total: 35400,
        status: "shipped",
        paymentStatus: "paid",
        paymentMethod: "Wire Transfer",
        orderDate: "2026-03-10",
        deliveryDate: "2026-03-20",
        shippingAddress: "789 Global Plaza, London, EC1A 1BB",
        billingAddress: "789 Global Plaza, London, EC1A 1BB",
        notes: "International shipping",
        trackingNumber: "INTL987654321",
        courier: "DHL"
      },
      {
        id: "ORD-004",
        orderNo: "ORD-2026-004",
        customerId: "CUST-004",
        customerName: "Innovate Ltd",
        customerEmail: "orders@innovate.com",
        customerPhone: "+1 234-567-893",
        customerAddress: "321 Innovation Way, Berlin, 10115",
        items: [
          { id: 6, name: "Hardware Package", sku: "SKU006", quantity: 3, price: 8000, total: 24000 },
          { id: 7, name: "Installation", sku: "SKU007", quantity: 1, price: 5000, total: 5000 }
        ],
        subtotal: 29000,
        tax: 5220,
        discount: 2000,
        shipping: 1000,
        total: 33220,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "",
        orderDate: "2026-03-16",
        deliveryDate: "",
        shippingAddress: "321 Innovation Way, Berlin, 10115",
        billingAddress: "321 Innovation Way, Berlin, 10115",
        notes: "Awaiting payment",
        trackingNumber: "",
        courier: ""
      },
      {
        id: "ORD-005",
        orderNo: "ORD-2026-005",
        customerId: "CUST-001",
        customerName: "Acme Corporation",
        customerEmail: "billing@acme.com",
        customerPhone: "+1 234-567-890",
        customerAddress: "123 Business Ave, New York, NY 10001",
        items: [
          { id: 1, name: "Product A", sku: "SKU001", quantity: 1, price: 5000, total: 5000 }
        ],
        subtotal: 5000,
        tax: 900,
        discount: 0,
        shipping: 500,
        total: 6400,
        status: "cancelled",
        paymentStatus: "refunded",
        paymentMethod: "Credit Card",
        orderDate: "2026-03-12",
        deliveryDate: "",
        shippingAddress: "123 Business Ave, New York, NY 10001",
        billingAddress: "123 Business Ave, New York, NY 10001",
        notes: "Cancelled by customer",
        trackingNumber: "",
        courier: ""
      }
    ];
  }

  function generateSampleCustomers() {
    return [
      { id: "CUST-001", name: "Acme Corporation", email: "billing@acme.com", phone: "+1 234-567-890", address: "123 Business Ave, New York, NY 10001", city: "New York", state: "NY", zip: "10001", country: "USA" },
      { id: "CUST-002", name: "TechStart Inc", email: "orders@techstart.com", phone: "+1 234-567-891", address: "456 Tech Blvd, San Francisco, CA 94105", city: "San Francisco", state: "CA", zip: "94105", country: "USA" },
      { id: "CUST-003", name: "Global Solutions", email: "purchasing@global.com", phone: "+1 234-567-892", address: "789 Global Plaza, London, EC1A 1BB", city: "London", state: "", zip: "EC1A 1BB", country: "UK" },
      { id: "CUST-004", name: "Innovate Ltd", email: "orders@innovate.com", phone: "+1 234-567-893", address: "321 Innovation Way, Berlin, 10115", city: "Berlin", state: "", zip: "10115", country: "Germany" }
    ];
  }

  function generateSampleProducts() {
    return [
      { id: 1, name: "Product A", sku: "SKU001", price: 5000, tax: 18, stock: 100, category: "Electronics" },
      { id: 2, name: "Service B", sku: "SKU002", price: 3000, tax: 18, stock: -1, category: "Service" },
      { id: 3, name: "Software License", sku: "SKU003", price: 2000, tax: 18, stock: 500, category: "Software" },
      { id: 4, name: "Support Package", sku: "SKU004", price: 5000, tax: 18, stock: -1, category: "Service" },
      { id: 5, name: "Consulting Hours", sku: "SKU005", price: 1500, tax: 18, stock: -1, category: "Service" },
      { id: 6, name: "Hardware Package", sku: "SKU006", price: 8000, tax: 18, stock: 50, category: "Hardware" },
      { id: 7, name: "Installation", sku: "SKU007", price: 5000, tax: 18, stock: -1, category: "Service" }
    ];
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => 
      order.paymentStatus === "paid" ? sum + order.total : sum, 0
    );
    
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const processingOrders = orders.filter(o => o.status === "processing").length;
    const shippedOrders = orders.filter(o => o.status === "shipped").length;
    const deliveredOrders = orders.filter(o => o.status === "delivered").length;
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
    
    const paidOrders = orders.filter(o => o.paymentStatus === "paid").length;
    const unpaidOrders = orders.filter(o => o.paymentStatus === "unpaid").length;
    const pendingPayment = orders.filter(o => o.paymentStatus === "pending").length;
    
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const monthlyRevenue = orders
      .filter(o => {
        const date = new Date(o.orderDate);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear && o.paymentStatus === "paid";
      })
      .reduce((sum, o) => sum + o.total, 0);
    
    const lastMonthRevenue = orders
      .filter(o => {
        const date = new Date(o.orderDate);
        return date.getMonth() === thisMonth - 1 && date.getFullYear() === thisYear && o.paymentStatus === "paid";
      })
      .reduce((sum, o) => sum + o.total, 0);
    
    const growth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : 0;
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      paidOrders,
      unpaidOrders,
      pendingPayment,
      avgOrderValue,
      monthlyRevenue,
      growth
    };
  }, [orders]);

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNo.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term) ||
        order.id.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // Payment filter
    if (filterPayment !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === filterPayment);
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= new Date(dateRange.start) && orderDate <= new Date(dateRange.end);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "date":
          aVal = new Date(a.orderDate);
          bVal = new Date(b.orderDate);
          break;
        case "total":
          aVal = a.total;
          bVal = b.total;
          break;
        case "customer":
          aVal = a.customerName;
          bVal = b.customerName;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
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
  }, [orders, searchTerm, filterStatus, filterPayment, dateRange, sortBy, sortOrder]);

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Generate order number
  const generateOrderNo = () => {
    const year = new Date().getFullYear();
    const count = String(orders.length + 1).padStart(3, '0');
    return `ORD-${year}-${count}`;
  };

  // Add order item
  const addOrderItem = () => {
    if (!newItem.name || !newItem.price) return;

    const item = {
      id: Date.now(),
      name: newItem.name,
      sku: newItem.sku,
      quantity: newItem.quantity || 1,
      price: parseFloat(newItem.price) || 0,
      total: (newItem.quantity || 1) * (parseFloat(newItem.price) || 0)
    };

    setNewOrder(prev => {
      const items = [...prev.items, item];
      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * 0.18; // 18% tax
      const total = subtotal + tax - prev.discount + prev.shipping;

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
      sku: "",
      quantity: 1,
      price: 0,
      total: 0
    });
  };

  // Remove order item
  const removeOrderItem = (itemId) => {
    setNewOrder(prev => {
      const items = prev.items.filter(i => i.id !== itemId);
      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const tax = subtotal * 0.18;
      const total = subtotal + tax - prev.discount + prev.shipping;

      return {
        ...prev,
        items,
        subtotal,
        tax,
        total
      };
    });
  };

  // Create order
  const createOrder = () => {
    if (newOrder.items.length === 0 || !newOrder.customerId) {
      showNotification("Please add items and select a customer", "error");
      return;
    }

    const order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      orderNo: generateOrderNo(),
      ...newOrder,
      orderDate: new Date().toISOString().split('T')[0]
    };

    setOrders([order, ...orders]);
    setShowAddModal(false);
    resetNewOrder();
    showNotification("Order created successfully");
  };

  // Update order
  const updateOrder = () => {
    if (!selectedOrder) return;

    setOrders(orders.map(o => 
      o.id === selectedOrder.id ? selectedOrder : o
    ));

    setShowEditModal(false);
    setSelectedOrder(null);
    showNotification("Order updated successfully");
  };

  // Delete order
  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter(o => o.id !== orderId));
      showNotification("Order deleted");
    }
  };

  // Bulk delete
  const bulkDelete = () => {
    if (selectedOrders.length === 0) return;
    
    if (window.confirm(`Delete ${selectedOrders.length} selected orders?`)) {
      setOrders(orders.filter(o => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
      setShowBulkActions(false);
      showNotification(`${selectedOrders.length} orders deleted`);
    }
  };

  // Bulk update status
  const bulkUpdateStatus = (status) => {
    setOrders(orders.map(o =>
      selectedOrders.includes(o.id) ? { ...o, status } : o
    ));
    setSelectedOrders([]);
    setShowBulkActions(false);
    showNotification(`Status updated to ${status}`);
  };

  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status } : o
    ));
    showNotification(`Order status updated to ${status}`);
  };

  // Update payment status
  const updatePaymentStatus = (orderId, paymentStatus) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, paymentStatus } : o
    ));
    showNotification(`Payment status updated to ${paymentStatus}`);
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Select all orders
  const selectAllOrders = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(o => o.id));
    }
  };

  // Reset new order form
  const resetNewOrder = () => {
    setNewOrder({
      orderNo: "",
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: "",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: "",
      shippingAddress: "",
      billingAddress: "",
      notes: "",
      trackingNumber: "",
      courier: ""
    });
  };

  // Duplicate order
  const duplicateOrder = (order) => {
    const duplicate = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      orderNo: generateOrderNo(),
      orderDate: new Date().toISOString().split('T')[0],
      status: "pending",
      paymentStatus: "unpaid"
    };

    setOrders([duplicate, ...orders]);
    showNotification("Order duplicated");
  };

  // Send WhatsApp
  const sendWhatsApp = (order) => {
    if (!order.customerPhone) {
      showNotification("No phone number available", "error");
      return;
    }

    const message = `*Order Confirmation* 🛒
━━━━━━━━━━━━━━━
*Order No:* ${order.orderNo}
*Customer:* ${order.customerName}
*Total:* ₹${order.total.toLocaleString()}
*Status:* ${order.status}
*Payment:* ${order.paymentStatus}
*Date:* ${order.orderDate}
━━━━━━━━━━━━━━━
Thank you for your order! 🙏`;

    const url = `https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showNotification("WhatsApp opened");
  };

  // Send Email
  const sendEmail = (order) => {
    if (!order.customerEmail) {
      showNotification("No email address available", "error");
      return;
    }
    
    const subject = encodeURIComponent(`Order Confirmation - ${order.orderNo}`);
    const body = encodeURIComponent(`Dear ${order.customerName},\n\nThank you for your order #${order.orderNo}.\n\nTotal Amount: ₹${order.total}\nStatus: ${order.status}\n\nWe will notify you when your order ships.\n\nBest regards,\nYour Company`);
    
    window.location.href = `mailto:${order.customerEmail}?subject=${subject}&body=${body}`;
    showNotification("Email client opened");
  };

  // Track order
  const trackOrder = (order) => {
    if (!order.trackingNumber) {
      showNotification("No tracking number available", "error");
      return;
    }

    let url = "";
    if (order.courier?.toLowerCase().includes("fedex")) {
      url = `https://www.fedex.com/fedextrack/?trknbr=${order.trackingNumber}`;
    } else if (order.courier?.toLowerCase().includes("dhl")) {
      url = `https://www.dhl.com/en/express/tracking.html?AWB=${order.trackingNumber}`;
    } else if (order.courier?.toLowerCase().includes("ups")) {
      url = `https://www.ups.com/track?tracknum=${order.trackingNumber}`;
    } else {
      url = `https://www.google.com/search?q=${order.trackingNumber}+tracking`;
    }

    window.open(url, '_blank');
    showNotification("Tracking opened");
  };

  // Print order
  const printOrder = (order) => {
    setSelectedOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ["Order No", "Customer", "Email", "Phone", "Total", "Status", "Payment", "Date", "Items"];
    const rows = orders.map(o => [
      o.orderNo,
      o.customerName,
      o.customerEmail || '',
      o.customerPhone || '',
      o.total,
      o.status,
      o.paymentStatus,
      o.orderDate,
      o.items.length
    ]);

    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification("CSV exported");
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
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "#f39c12";
      case "processing": return "#3498db";
      case "shipped": return "#9b59b6";
      case "delivered": return "#2ecc71";
      case "cancelled": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  // Get payment status color
  const getPaymentColor = (status) => {
    switch(status) {
      case "paid": return "#2ecc71";
      case "pending": return "#f39c12";
      case "unpaid": return "#e74c3c";
      case "refunded": return "#95a5a6";
      default: return "#95a5a6";
    }
  };

  return (
    <div className="orders-container">
      
      {/* Header */}
      <div className="orders-header">
        <div className="header-left">
          <h1>
            <span className="header-icon">📦</span>
            Order Management
          </h1>
          <p className="header-subtitle">Manage and track all customer orders</p>
        </div>

        <div className="header-actions">
          <button 
            className={`view-toggle ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📊 Table
          </button>
          <button 
            className={`view-toggle ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            📇 Cards
          </button>
          <button className="export-btn" onClick={exportCSV}>
            📥 Export
          </button>
          <button 
            className="create-btn"
            onClick={() => setShowAddModal(true)}
          >
            + New Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{metrics.totalOrders}</span>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">{formatCurrency(metrics.totalRevenue)}</span>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{metrics.pendingOrders}</span>
          </div>
        </div>

        <div className="stat-card processing">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <span className="stat-label">Processing</span>
            <span className="stat-value">{metrics.processingOrders}</span>
          </div>
        </div>

        <div className="stat-card shipped">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <span className="stat-label">Shipped</span>
            <span className="stat-value">{metrics.shippedOrders}</span>
          </div>
        </div>

        <div className="stat-card delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Delivered</span>
            <span className="stat-value">{metrics.deliveredOrders}</span>
          </div>
        </div>

        <div className="stat-card paid">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <span className="stat-label">Paid</span>
            <span className="stat-value">{metrics.paidOrders}</span>
          </div>
        </div>

        <div className="stat-card average">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Avg Order</span>
            <span className="stat-value">{formatCurrency(metrics.avgOrderValue)}</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bulk-actions">
          <span className="selected-count">{selectedOrders.length} selected</span>
          <div className="bulk-buttons">
            <button onClick={selectAllOrders}>
              {selectedOrders.length === currentOrders.length ? 'Deselect All' : 'Select All'}
            </button>
            <button onClick={() => bulkUpdateStatus("pending")}>⏳ Pending</button>
            <button onClick={() => bulkUpdateStatus("processing")}>⚙️ Processing</button>
            <button onClick={() => bulkUpdateStatus("shipped")}>🚚 Shipped</button>
            <button onClick={() => bulkUpdateStatus("delivered")}>✅ Delivered</button>
            <button className="delete-bulk" onClick={bulkDelete}>🗑️ Delete</button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by order #, customer, email..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            className="filter-select"
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Amount</option>
            <option value="customer">Sort by Customer</option>
            <option value="status">Sort by Status</option>
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

      {/* Results Info */}
      <div className="results-info">
        <span>Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredOrders.length)} of {filteredOrders.length} orders</span>
        <span className="total-amount">Total: {formatCurrency(filteredOrders.reduce((sum, o) => sum + o.total, 0))}</span>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                    onChange={selectAllOrders}
                  />
                </th>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map(order => (
                  <tr key={order.id} className={selectedOrders.includes(order.id) ? 'selected-row' : ''}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                      />
                    </td>
                    <td className="order-no">{order.orderNo}</td>
                    <td>
                      <div className="customer-info">
                        <span className="customer-name">{order.customerName}</span>
                        <small className="customer-email">{order.customerEmail}</small>
                      </div>
                    </td>
                    <td>{order.items.length} items</td>
                    <td className="amount">{formatCurrency(order.total)}</td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="payment-badge"
                        style={{ backgroundColor: getPaymentColor(order.paymentStatus) }}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>{order.orderDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          title="View"
                        >
                          👁️
                        </button>
                        <button 
                          className="action-btn edit"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowEditModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn copy"
                          onClick={() => duplicateOrder(order)}
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button 
                          className="action-btn whatsapp"
                          onClick={() => sendWhatsApp(order)}
                          title="WhatsApp"
                        >
                          📱
                        </button>
                        <button 
                          className="action-btn email"
                          onClick={() => sendEmail(order)}
                          title="Email"
                        >
                          📧
                        </button>
                        {order.trackingNumber && (
                          <button 
                            className="action-btn track"
                            onClick={() => trackOrder(order)}
                            title="Track"
                          >
                          🚚
                          </button>
                        )}
                        <button 
                          className="action-btn print"
                          onClick={() => printOrder(order)}
                          title="Print"
                        >
                          🖨️
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => deleteOrder(order.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    <div className="no-results-content">
                      <span className="no-results-icon">📭</span>
                      <h3>No orders found</h3>
                      <p>Try adjusting your filters or create a new order</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === 'cards' && (
        <div className="orders-grid">
          {currentOrders.map(order => (
            <div key={order.id} className={`order-card ${selectedOrders.includes(order.id) ? 'selected' : ''}`}>
              <div className="card-header">
                <div className="card-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                  />
                </div>
                <span className="order-no">{order.orderNo}</span>
                <span className="order-date">{order.orderDate}</span>
              </div>

              <div className="card-body">
                <h4>{order.customerName}</h4>
                <p className="customer-email">{order.customerEmail}</p>
                
                <div className="card-items">
                  <span className="items-count">{order.items.length} items</span>
                  <span className="items-total">{formatCurrency(order.total)}</span>
                </div>

                <div className="card-badges">
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {order.status}
                  </span>
                  <span className="payment-badge" style={{ backgroundColor: getPaymentColor(order.paymentStatus) }}>
                    {order.paymentStatus}
                  </span>
                </div>

                {order.trackingNumber && (
                  <div className="tracking-info">
                    <span>📦 {order.trackingNumber}</span>
                    <small>{order.courier}</small>
                  </div>
                )}
              </div>

              <div className="card-footer">
                <button className="card-btn view" onClick={() => {
                  setSelectedOrder(order);
                  setShowDetailsModal(true);
                }}>👁️</button>
                <button className="card-btn edit" onClick={() => {
                  setSelectedOrder(order);
                  setShowEditModal(true);
                }}>✏️</button>
                <button className="card-btn copy" onClick={() => duplicateOrder(order)}>📋</button>
                <button className="card-btn whatsapp" onClick={() => sendWhatsApp(order)}>📱</button>
                <button className="card-btn email" onClick={() => sendEmail(order)}>📧</button>
                {order.trackingNumber && (
                  <button className="card-btn track" onClick={() => trackOrder(order)}>🚚</button>
                )}
                <button className="card-btn print" onClick={() => printOrder(order)}>🖨️</button>
                <button className="card-btn delete" onClick={() => deleteOrder(order.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > itemsPerPage && (
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

      {/* Create Order Modal */}
      {showAddModal && (
        <div className="modal" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Order</h2>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>

            <div className="order-form">
              {/* Customer Selection */}
              <div className="form-section">
                <h3>Customer Details</h3>
                <select
                  className="form-select"
                  value={newOrder.customerId}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setNewOrder({
                      ...newOrder,
                      customerId: customer?.id || "",
                      customerName: customer?.name || "",
                      customerEmail: customer?.email || "",
                      customerPhone: customer?.phone || "",
                      customerAddress: customer?.address || "",
                      shippingAddress: customer?.address || "",
                      billingAddress: customer?.address || ""
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
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({...newOrder, customerPhone: e.target.value})}
                  />
                </div>
              </div>

              {/* Order Items */}
              <div className="form-section">
                <h3>Order Items</h3>
                
                <div className="items-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {newOrder.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.sku}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{formatCurrency(item.total)}</td>
                          <td>
                            <button 
                              className="remove-item"
                              onClick={() => removeOrderItem(item.id)}
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
                        sku: product?.sku || "",
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
                  <button className="add-item-btn" onClick={addOrderItem}>
                    Add Item
                  </button>
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="form-section">
                <h3>Shipping & Payment</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Shipping Address</label>
                    <textarea
                      rows="2"
                      value={newOrder.shippingAddress}
                      onChange={(e) => setNewOrder({...newOrder, shippingAddress: e.target.value})}
                      placeholder="Shipping address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Billing Address</label>
                    <textarea
                      rows="2"
                      value={newOrder.billingAddress}
                      onChange={(e) => setNewOrder({...newOrder, billingAddress: e.target.value})}
                      placeholder="Billing address"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      value={newOrder.deliveryDate}
                      onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={newOrder.paymentMethod}
                      onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                    >
                      <option value="">Select Method</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                      <option value="Check">Check</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Courier</label>
                    <input
                      type="text"
                      placeholder="Courier name"
                      value={newOrder.courier}
                      onChange={(e) => setNewOrder({...newOrder, courier: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      placeholder="Tracking number"
                      value={newOrder.trackingNumber}
                      onChange={(e) => setNewOrder({...newOrder, trackingNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows="2"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(newOrder.subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18%):</span>
                  <span>{formatCurrency(newOrder.tax)}</span>
                </div>
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(newOrder.discount)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{formatCurrency(newOrder.shipping)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{formatCurrency(newOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <button className="save-btn" onClick={createOrder}>
                  Create Order
                </button>
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="modal" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Order - {selectedOrder.orderNo}</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>

            <div className="order-form">
              <div className="form-section">
                <h3>Order Status</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => setSelectedOrder({...selectedOrder, paymentStatus: e.target.value})}
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      value={selectedOrder.deliveryDate}
                      onChange={(e) => setSelectedOrder({...selectedOrder, deliveryDate: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      value={selectedOrder.trackingNumber || ''}
                      onChange={(e) => setSelectedOrder({...selectedOrder, trackingNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    rows="2"
                    value={selectedOrder.notes || ''}
                    onChange={(e) => setSelectedOrder({...selectedOrder, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="save-btn" onClick={updateOrder}>
                  Update Order
                </button>
                <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNo}</h2>
              <button className="close-modal" onClick={() => setShowDetailsModal(false)}>
                ✕
              </button>
            </div>

            <div className="order-details">
              <div className="details-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              </div>

              <div className="details-section">
                <h3>Order Information</h3>
                <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
                <p><strong>Status:</strong> 
                  <span className="status-badge" style={{backgroundColor: getStatusColor(selectedOrder.status)}}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Payment:</strong>
                  <span className="payment-badge" style={{backgroundColor: getPaymentColor(selectedOrder.paymentStatus)}}>
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
              </div>

              <div className="details-section">
                <h3>Shipping Information</h3>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                {selectedOrder.deliveryDate && (
                  <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
                )}
                {selectedOrder.trackingNumber && (
                  <>
                    <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                    <p><strong>Courier:</strong> {selectedOrder.courier || 'N/A'}</p>
                  </>
                )}
              </div>

              <div className="details-section">
                <h3>Order Items</h3>
                <table className="items-details-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="details-section">
                <h3>Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="details-section">
                  <h3>Notes</h3>
                  <p className="order-notes">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="edit-btn" onClick={() => {
                setShowDetailsModal(false);
                setShowEditModal(true);
              }}>✏️ Edit Order</button>
              <button className="print-btn" onClick={() => printOrder(selectedOrder)}>🖨️ Print</button>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
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