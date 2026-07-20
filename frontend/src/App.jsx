import React from 'react';
import ServiceCard from './components/stats/ServiceCard';
import Search from './pages/Search/Search';
import ListingDetail from './pages/ListingDetail/ListingDetail';

function App() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <ListingDetail/>
    </div>
  );
}

export default App;