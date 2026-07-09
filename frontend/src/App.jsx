import React from 'react';
import StatCard from './components/stats/StatCard';

function App() {
  return (
    <div style={{ padding : '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1>Component Testing Sandbox</h1>

      {/* Testing the StatCard component with sample data */}
      <StatCard
        displayName="FutureDoc_99"
        undergradMajor="Biomedical Engineering"
        cgpa={3.9}
        sgpa={3.8}
        mcat={520}
        clinicalHours={250}
        researchHours={150}
        shadowingHours={100}
        volunteerHours={200}
        adviceText="Stay consistent with your studies and seek mentorship early!"
      />
    </div>
  );
}

export default App;