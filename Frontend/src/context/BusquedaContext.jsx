import { createContext, useContext, useState } from 'react';

// IMPORTANTE: este const NO se exporta. Dejarlo privado al módulo es lo que
// permite que Fast Refresh (HMR de React) preserve el estado al editar archivos
// que importen "useBusqueda" o "BusquedaProvider".
const BusquedaContext = createContext(null);

// Provider que envuelve a toda la app desde App.jsx.
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
