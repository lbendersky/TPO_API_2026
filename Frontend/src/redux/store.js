import {configureStore} from '@reduxjs/toolkit';
import turnosReducer from './turnosSlice';
import canchasReducer from './canchasSlice';
import carritoReducer from '../Redux/carritoSlice';

export const store = configureStore({
  reducer: {
    turnos: turnosReducer,
    carrito: carritoReducer,
    canchas: canchasReducer,
  },
});

export default store;
