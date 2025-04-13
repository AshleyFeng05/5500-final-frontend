import { Provider } from 'react-redux';
import { store } from './services/store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Customer from './customer';
import Dasher from './dasher';
import Restaurant from './restaurant';

import './App.scss';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Customer Routes */}
          <Route path="/*" element={<Customer />} />

          {/* Dasher Routes */}
          <Route path="/dasher/*" element={<Dasher />} />

          <Route path="/restaurant/*" element={<Restaurant />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
