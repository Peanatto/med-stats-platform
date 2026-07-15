import React from 'react';
import ServiceCard from './components/stats/ServiceCard';

function App() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1>Component Testing Sandbox</h1>

      {/* Testing the new ServiceCard component with sample data */}
      <ServiceCard
        displayName="FutureDoc_99"
        undergradMajor="Biomedical Engineering"

        /* Offerings */
        title="1-on-1 MCAT Strategy & Comprehensive Schedule Planning"
        category="MCAT Tutoring"
        hourlyRate={35}
        rating={4.9}
        reviewCount={24}
        
        /* Academic Credentials */
        cgpa={3.90}
        sgpa={3.80}
        mcat={520}
        
        /* Experience Background */
        clinicalHours={250}
        researchHours={150}
        shadowingHours={100}
        volunteerHours={200}
        
        adviceSnippet="Stay consistent with your studies and seek mentorship early!"
        
        /* Testing the Book Now click handler */
        onBookNow={(serviceInfo) => alert(`Booking requested for: ${serviceInfo.title} with ${serviceInfo.displayName}`)}
      />
    </div>
  );
}

export default App;