import {configureStore} from '@reduxjs/toolkit';
import localidadesReducer from './localidadesSlice';

export const store = configureStore({
  reducer: {
    localidades : localidadesReducer,
  },
});

export default store;
