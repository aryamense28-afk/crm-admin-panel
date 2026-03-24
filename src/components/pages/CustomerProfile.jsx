import React from "react";

export default function CustomerProfile({ customer }) {

  return (
    <div className="customer-profile">

      <h2>{customer.name}</h2>

      <p>Email: {customer.email}</p>
      <p>Company: {customer.company}</p>
      <p>Phone: {customer.phone}</p>

      <h3>Recent Deals</h3>

      <ul>
        {customer.deals.map((deal) => (
          <li key={deal.id}>
            {deal.name} - ${deal.value}
          </li>
        ))}
      </ul>

    </div>
  );
}