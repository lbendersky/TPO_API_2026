import { useState } from 'react';
import { BusquedaContext } from './BusquedaContextBase';

export const BusquedaProvider = ({ children }) => {
    const [texto, setTexto] = useState('');

    return (
        <BusquedaContext.Provider value={{ texto, setTexto }}>
            {children}
        </BusquedaContext.Provider>
    );
};