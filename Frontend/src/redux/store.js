import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';

import turnosReducer from './turnosSlice';
import canchasReducer from './canchasSlice';
import carritoReducer from './carritoSlice';
import inscripcionesReducer from './inscripcionesSlice';
import usuariosReducer from './usuariosSlice';
import ofertasReducer from './ofertasSlice';

// Adaptador de almacenamiento compatible con Promise para redux-persist
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

// Configuración de persistencia solo para usuarios (sesión, token y estado de login)
const persistConfigUsuarios = {
  key: 'usuarios',
  storage,
  whitelist: ['token', 'usuario', 'estaLogueado'],
};

const rootReducer = combineReducers({
  turnos: turnosReducer,
  canchas: canchasReducer,
  carrito: carritoReducer,
  inscripciones: inscripcionesReducer,
  usuarios: persistReducer(persistConfigUsuarios, usuariosReducer),
  ofertas: ofertasReducer,
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