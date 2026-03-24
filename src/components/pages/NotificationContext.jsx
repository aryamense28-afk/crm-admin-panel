import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {

  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {

    setNotifications([
      ...notifications,
      { id: Date.now(), message }
    ]);

  };

  return (

    <NotificationContext.Provider
      value={{ notifications, addNotification }}
    >

      {children}

    </NotificationContext.Provider>

  );

}