import {configureStore} from '@reduxjs/toolkit';
import turnosReducer from './turnosSlice';

export const store = configureStore({
  reducer: {
    turnos: turnosReducer,
  },
});

export default store;
