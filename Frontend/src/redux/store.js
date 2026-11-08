import {configureStore} from '@reduxjs/toolkit';
import turnosReducer from './turnosSlice';
import canchasReducer from './canchasSlice';

export const store = configureStore({
  reducer: {
    turnos: turnosReducer,
    canchas: canchasReducer,
  },
});

export default store;
