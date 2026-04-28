import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div id="toast" style={{
        position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        {toasts.map(toast => (
          <div key={toast.id} className={`alert alert-${toast.type} shadow`} style={{ minWidth: '300px', cursor: 'pointer', margin: 0 }} onClick={() => removeToast(toast.id)}>
            <div className="d-flex align-items-center">
              <strong>{toast.message}</strong>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
