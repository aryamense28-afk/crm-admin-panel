import React, { useState, useEffect } from "react";
import "./Email.css";

export default function Email() {
  const [form, setForm] = useState({
    to: "",
    subject: "",
    message: "",
    cc: "",
    bcc: "",
    attachments: [],
    priority: "normal",
    template: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [emailHistory, setEmailHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [scheduledSend, setScheduledSend] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Load email history and templates from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("emailHistory");
    if (savedHistory) {
      setEmailHistory(JSON.parse(savedHistory));
    }

    const savedTemplates = localStorage.getItem("emailTemplates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      // Default templates
      const defaultTemplates = [
        {
          id: 1,
          name: "Welcome Email",
          subject: "Welcome to Our CRM!",
          message: "Dear [Name],\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team"
        },
        {
          id: 2,
          name: "Password Reset",
          subject: "Password Reset Request",
          message: "Dear [Name],\n\nWe received a request to reset your password. Click the link below to proceed.\n\n[Reset Link]\n\nIf you didn't request this, please ignore this email."
        },
        {
          id: 3,
          name: "Invoice Reminder",
          subject: "Invoice Due Reminder",
          message: "Dear [Name],\n\nThis is a reminder that your invoice #[Invoice Number] is due on [Due Date].\n\nPlease process the payment at your earliest convenience.\n\nThank you!"
        }
      ];
      setTemplates(defaultTemplates);
      localStorage.setItem("emailTemplates", JSON.stringify(defaultTemplates));
    }
  }, []);

  // Update character count
  useEffect(() => {
    setCharCount(form.message.length);
  }, [form.message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ""
      });
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setForm({
        ...form,
        subject: template.subject,
        message: template.message,
        template: template.name
      });
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!form.to) {
      errors.to = "Recipient email is required";
    } else {
      const emails = form.to.split(',').map(e => e.trim());
      const invalidEmails = emails.filter(e => !validateEmail(e));
      if (invalidEmails.length > 0) {
        errors.to = `Invalid email(s): ${invalidEmails.join(', ')}`;
      }
    }

    if (form.cc) {
      const ccs = form.cc.split(',').map(e => e.trim());
      const invalidCCs = ccs.filter(e => !validateEmail(e));
      if (invalidCCs.length > 0) {
        errors.cc = `Invalid CC email(s): ${invalidCCs.join(', ')}`;
      }
    }

    if (form.bcc) {
      const bccs = form.bcc.split(',').map(e => e.trim());
      const invalidBCCs = bccs.filter(e => !validateEmail(e));
      if (invalidBCCs.length > 0) {
        errors.bcc = `Invalid BCC email(s): ${invalidBCCs.join(', ')}`;
      }
    }

    if (!form.subject) {
      errors.subject = "Subject is required";
    }

    if (!form.message) {
      errors.message = "Message is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const saveToHistory = (emailData, status) => {
    const historyEntry = {
      id: Date.now(),
      to: emailData.to,
      subject: emailData.subject,
      date: new Date().toISOString(),
      status: status,
      priority: emailData.priority,
      scheduledFor: scheduledSend || null
    };

    const updatedHistory = [historyEntry, ...emailHistory].slice(0, 50); // Keep last 50
    setEmailHistory(updatedHistory);
    localStorage.setItem("emailHistory", JSON.stringify(updatedHistory));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("validation-error");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      // Prepare form data for attachments
      const formData = new FormData();
      formData.append("to", form.to);
      formData.append("subject", form.subject);
      formData.append("message", form.message);
      formData.append("cc", form.cc);
      formData.append("bcc", form.bcc);
      formData.append("priority", form.priority);
      
      if (scheduledSend) {
        formData.append("scheduledSend", scheduledSend);
      }

      attachments.forEach((attachment, index) => {
        formData.append("attachments", attachment.file);
      });

      const res = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        saveToHistory(form, "sent");

        // Reset form
        setForm({
          to: "",
          subject: "",
          message: "",
          cc: "",
          bcc: "",
          attachments: [],
          priority: "normal",
          template: ""
        });
        setAttachments([]);
        setScheduledSend("");

        // Auto-hide success message after 5 seconds
        setTimeout(() => setStatus(""), 5000);
      } else {
        setStatus("error");
        saveToHistory(form, "failed");
        console.error("Server error:", data.error);
      }
    } catch (err) {
      setStatus("error");
      saveToHistory(form, "failed");
      console.error("Network error:", err);
    }

    setLoading(false);
  };

  const scheduleEmail = async () => {
    if (!scheduledSend) {
      alert("Please select a date and time to schedule");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/schedule-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          scheduledFor: scheduledSend
        })
      });

      if (res.ok) {
        setStatus("scheduled");
        saveToHistory(form, "scheduled");
        
        setForm({
          to: "",
          subject: "",
          message: "",
          cc: "",
          bcc: "",
          attachments: [],
          priority: "normal",
          template: ""
        });
        setScheduledSend("");
      }
    } catch (err) {
      setStatus("error");
    }

    setLoading(false);
  };

  const sendTestEmail = async () => {
    setForm({
      ...form,
      to: "test@example.com"
    });
    setTimeout(() => sendEmail(new Event('submit')), 100);
  };

  const clearHistory = () => {
    if (window.confirm("Clear all email history?")) {
      setEmailHistory([]);
      localStorage.removeItem("emailHistory");
    }
  };

  return (
    <div className="email-page">
      <div className="email-container">
        
        {/* Header with Actions */}
        <div className="email-header">
          <div className="header-left">
            <h2>📧 Email Composer</h2>
            <p className="header-subtitle">Send professional emails to your customers</p>
          </div>
          <div className="header-actions">
            <button 
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "✕ Close History" : "📋 Email History"}
            </button>
            <button 
              className="test-btn"
              onClick={sendTestEmail}
              disabled={loading}
            >
              🧪 Test Mode
            </button>
          </div>
        </div>

        {/* Email History Panel */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>📋 Recent Emails</h3>
              <button className="clear-history" onClick={clearHistory}>
                Clear All
              </button>
            </div>
            <div className="history-list">
              {emailHistory.length > 0 ? (
                emailHistory.map(email => (
                  <div key={email.id} className={`history-item ${email.status}`}>
                    <div className="history-item-header">
                      <span className="history-to">{email.to}</span>
                      <span className={`history-status ${email.status}`}>
                        {email.status === "sent" && "✅"}
                        {email.status === "scheduled" && "⏰"}
                        {email.status === "failed" && "❌"}
                        {email.status}
                      </span>
                    </div>
                    <div className="history-subject">{email.subject}</div>
                    <div className="history-date">
                      📅 {new Date(email.date).toLocaleString()}
                      {email.scheduledFor && ` (Scheduled: ${new Date(email.scheduledFor).toLocaleString()})`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-history">No emails sent yet</div>
              )}
            </div>
          </div>
        )}

        {/* Main Email Card */}
        <div className="email-card">
          
          {/* Status Messages */}
          {status === "success" && (
            <div className="alert success">
              <span className="alert-icon">✅</span>
              <div className="alert-content">
                <strong>Email sent successfully!</strong>
                <p>Your email has been delivered to the recipient.</p>
              </div>
              <button className="alert-close" onClick={() => setStatus("")}>✕</button>
            </div>
          )}

          {status === "scheduled" && (
            <div className="alert info">
              <span className="alert-icon">⏰</span>
              <div className="alert-content">
                <strong>Email scheduled!</strong>
                <p>Your email has been scheduled for {new Date(scheduledSend).toLocaleString()}</p>
              </div>
              <button className="alert-close" onClick={() => setStatus("")}>✕</button>
            </div>
          )}

          {status === "error" && (
            <div className="alert error">
              <span className="alert-icon">❌</span>
              <div className="alert-content">
                <strong>Failed to send email</strong>
                <p>Please check your connection and try again.</p>
              </div>
              <button className="alert-close" onClick={() => setStatus("")}>✕</button>
            </div>
          )}

          {status === "validation-error" && Object.keys(validationErrors).length > 0 && (
            <div className="alert warning">
              <span className="alert-icon">⚠️</span>
              <div className="alert-content">
                <strong>Please fix the following errors:</strong>
                <ul>
                  {Object.values(validationErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Template Selector */}
          <div className="template-selector">
            <select 
              onChange={(e) => handleTemplateSelect(e.target.value)}
              value={selectedTemplate}
            >
              <option value="">📝 Select a template...</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={sendEmail} encType="multipart/form-data">
            
            {/* Priority Selector */}
            <div className="priority-selector">
              <label>Priority:</label>
              <div className="priority-options">
                <label className={form.priority === "low" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={form.priority === "low"}
                    onChange={handleChange}
                  />
                  <span className="priority-badge low">🟢 Low</span>
                </label>
                <label className={form.priority === "normal" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="priority"
                    value="normal"
                    checked={form.priority === "normal"}
                    onChange={handleChange}
                  />
                  <span className="priority-badge normal">🟡 Normal</span>
                </label>
                <label className={form.priority === "high" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={form.priority === "high"}
                    onChange={handleChange}
                  />
                  <span className="priority-badge high">🔴 High</span>
                </label>
              </div>
            </div>

            {/* To Field */}
            <div className="form-group">
              <label>To <span className="required">*</span></label>
              <input
                name="to"
                type="text"
                placeholder="recipient@example.com, another@example.com"
                value={form.to}
                onChange={handleChange}
                className={validationErrors.to ? "error" : ""}
                required
              />
              {validationErrors.to && (
                <span className="field-error">{validationErrors.to}</span>
              )}
              <small className="field-hint">Separate multiple emails with commas</small>
            </div>

            {/* Advanced Options Toggle */}
            <button 
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "▼ Hide Advanced" : "▶ Show Advanced"}
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <>
                <div className="form-group">
                  <label>CC</label>
                  <input
                    name="cc"
                    type="text"
                    placeholder="cc@example.com"
                    value={form.cc}
                    onChange={handleChange}
                    className={validationErrors.cc ? "error" : ""}
                  />
                  {validationErrors.cc && (
                    <span className="field-error">{validationErrors.cc}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>BCC</label>
                  <input
                    name="bcc"
                    type="text"
                    placeholder="bcc@example.com"
                    value={form.bcc}
                    onChange={handleChange}
                    className={validationErrors.bcc ? "error" : ""}
                  />
                  {validationErrors.bcc && (
                    <span className="field-error">{validationErrors.bcc}</span>
                  )}
                </div>
              </>
            )}

            {/* Subject Field */}
            <div className="form-group">
              <label>Subject <span className="required">*</span></label>
              <input
                name="subject"
                type="text"
                placeholder="Email subject"
                value={form.subject}
                onChange={handleChange}
                className={validationErrors.subject ? "error" : ""}
                required
              />
              {validationErrors.subject && (
                <span className="field-error">{validationErrors.subject}</span>
              )}
            </div>

            {/* Message Field with Character Count */}
            <div className="form-group">
              <label>Message <span className="required">*</span></label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                rows="8"
                value={form.message}
                onChange={handleChange}
                className={validationErrors.message ? "error" : ""}
                required
              />
              <div className="message-footer">
                {validationErrors.message && (
                  <span className="field-error">{validationErrors.message}</span>
                )}
                <span className="char-count">
                  {charCount} characters
                  {charCount > 1000 && <span className="warning"> (Message is long)</span>}
                </span>
              </div>
            </div>

            {/* Attachments */}
            <div className="form-group">
              <label>Attachments</label>
              <div className="attachment-area">
                <input
                  type="file"
                  multiple
                  onChange={handleAttachment}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="attach-btn"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  📎 Attach Files
                </button>
              </div>
              {attachments.length > 0 && (
                <div className="attachment-list">
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item">
                      <span className="attachment-icon">
                        {file.type.startsWith('image/') ? '🖼️' : '📄'}
                      </span>
                      <span className="attachment-name">{file.name}</span>
                      <span className="attachment-size">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        type="button"
                        className="remove-attachment"
                        onClick={() => removeAttachment(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule Option */}
            <div className="schedule-option">
              <label>
                <input
                  type="checkbox"
                  checked={!!scheduledSend}
                  onChange={(e) => setScheduledSend(e.target.checked ? new Date().toISOString().slice(0, 16) : "")}
                />
                Schedule for later
              </label>
              {scheduledSend && (
                <input
                  type="datetime-local"
                  value={scheduledSend}
                  onChange={(e) => setScheduledSend(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                type="submit" 
                className="send-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner">⏳</span>
                    Sending...
                  </>
                ) : (
                  "📤 Send Email"
                )}
              </button>

              {scheduledSend && (
                <button
                  type="button"
                  className="schedule-btn"
                  onClick={scheduleEmail}
                  disabled={loading}
                >
                  ⏰ Schedule
                </button>
              )}

              <button
                type="button"
                className="reset-btn"
                onClick={() => {
                  if (window.confirm("Clear all fields?")) {
                    setForm({
                      to: "",
                      subject: "",
                      message: "",
                      cc: "",
                      bcc: "",
                      attachments: [],
                      priority: "normal",
                      template: ""
                    });
                    setAttachments([]);
                    setValidationErrors({});
                  }
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-action" onClick={() => {
              setForm({
                ...form,
                message: form.message + "\n\nBest regards,\n[Your Name]"
              });
            }}>
              Add Signature
            </button>
            <button className="quick-action" onClick={() => {
              navigator.clipboard.writeText(form.message);
              alert("Message copied to clipboard!");
            }}>
              📋 Copy Message
            </button>
          </div>
        </div>

        {/* Email Tips */}
        <div className="email-tips">
          <h4>💡 Email Tips</h4>
          <ul>
            <li>Keep your subject line clear and concise</li>
            <li>Use bullet points for easy reading</li>
            <li>Always proofread before sending</li>
            <li>Include a clear call-to-action</li>
          </ul>
        </div>
      </div>
    </div>
  );
}