import React, { createContext, useContext, useState } from "react";

interface Notification {
  id: string;
  message: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => removeNotification(id), 10000); 
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <NotificationDisplay notifications={notifications} />
    </NotificationContext.Provider>
  );
};

const NotificationDisplay: React.FC<{ notifications: Notification[] }> = ({ notifications }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 1000 }}>
    {notifications.map((n) => (
      <div key={n.id} style={{ background: "lightblue", padding: "10px", margin: "5px" }}>
        {n.message}
      </div>
    ))}
  </div>
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
