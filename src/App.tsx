import { Provider } from 'react-redux';
import { store } from './app/store';


import AppNavbar from './components/AppNavbar';

import './App.scss';



function App() {
  return (
    <Provider store={store}>
      <AppNavbar />
      <div className="App" style={{ marginTop: '56px' }}>
        <header className="App-header">
          <h1>Welcome to My App</h1>
          <p>This is a simple React application.</p>

        </header>
      </div>
    </Provider>
  );
}

export default App;
