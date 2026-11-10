import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import turnosReducer from './turnosSlice';
import canchasReducer from './canchasSlice';
import usuariosReducer from './usuariosSlice';


const storage = {
  getItem(key) {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem(key, value) {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem(key) {
    return Promise.resolve(localStorage.removeItem(key));
  },
};

const persistConfigUsuarios = {
  key: 'usuarios',
  storage,
  whitelist: ['token', 'usuario', 'estaLogueado'],
};

const rootReducer = combineReducers({
  turnos: turnosReducer,
  canchas: canchasReducer,
  usuarios: persistReducer(persistConfigUsuarios, usuariosReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;