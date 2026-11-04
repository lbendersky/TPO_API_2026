import { useContext } from 'react';
import { BusquedaContext } from './BusquedaContextBase';

export const useBusqueda = () => useContext(BusquedaContext);