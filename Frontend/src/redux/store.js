import {configureStore} from '@reduxjs/toolkit';
import turnosReducer from './turnosSlice';
import carritoReducer from './carritoSlice'

export const store = configureStore({
  reducer: {
    turnos: turnosReducer,
    carrito: carritoReducer,
  },
});

export default store;
