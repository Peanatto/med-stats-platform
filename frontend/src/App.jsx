import React from 'react';
import ServiceCard from './components/stats/ServiceCard';
import Search from './pages/Search/Search';

function App() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Search/>
    </div>
  );
}

export default App;