// Archivo que permite la busqueda en tiempo real

import { createContext, useContext, useState } from 'react';

const BusquedaContext = createContext(null);

export const BusquedaProvider = ({ children }) => {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    return (
        <BusquedaContext.Provider value={{ textoBusqueda, setTextoBusqueda }}>
            {children}
        </BusquedaContext.Provider>
    );
};

// Hook para consumir el contexto desde cualquier componente hijo.
export const useBusqueda = () => useContext(BusquedaContext);
