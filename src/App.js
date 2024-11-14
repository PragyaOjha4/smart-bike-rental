import React, { useState } from 'react';
import UserView from './userView';
import MaintainerView from './MaintainerView';

function App() {
  const [view, setView] = useState('landing');

  return (
    <div className="App">
      {view === 'landing' && (
        <div className="landing-page">
          <h1>Welcome to Smart Bike Rental</h1>
          <button onClick={() => setView('user')}>User</button>
          <button onClick={() => setView('maintainer')}>Maintainer</button>
        </div>
      )}
      {view === 'user' && <UserView />}
      {view === 'maintainer' && <MaintainerView />}
    </div>
  );
}

export default App;
