import {configureStore} from '@reduxjs/toolkit';
import localidadesReducer from './localidadesSlice';
import turnosReducer from './turnosSlice';

export const store = configureStore({
  reducer: {
    localidades : localidadesReducer,
    turnos: turnosReducer,
  },
});

export default store;
