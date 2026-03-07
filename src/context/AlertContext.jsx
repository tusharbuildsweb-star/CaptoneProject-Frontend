import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        isOpen: false,
        type: 'info', // 'success', 'error', 'warning', 'info'
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
        showCancel: false,
        confirmText: 'OK',
        cancelText: 'Cancel'
    });

    const showAlert = useCallback(({
        type = 'info',
        title = '',
        message = '',
        onConfirm = null,
        onCancel = null,
        showCancel = false,
        confirmText = 'OK',
        cancelText = 'Cancel'
    }) => {
        setAlert({
            isOpen: true,
            type,
            title,
            message,
            onConfirm,
            onCancel,
            showCancel,
            confirmText,
            cancelText
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
            {children}
        </AlertContext.Provider>
    );
};
