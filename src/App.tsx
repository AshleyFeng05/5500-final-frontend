import { Provider } from 'react-redux';
import { store } from './app/store';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';

import './App.scss';


function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
}

export default App;
