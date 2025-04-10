import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Customer from './customer/index';
import Dasher from './dasher';

import './App.scss';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Customer Routes */}
          <Route path="/*">
            <Route index element={<Customer />} />
          </Route>


          {/* Dasher Routes */}
          <Route path="/dasher">
            <Route index element={<Dasher />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
