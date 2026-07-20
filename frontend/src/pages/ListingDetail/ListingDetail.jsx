import React from 'react';
import ServiceDetail from '../../components/listings/ServiceDetail';
import MentorSidebar from '../../components/listings/MentorSidebar';
import './ListingDetail.css';

// 1. Temporary Mock Data (You can swap this for an import from mockProfiles.js later!)
const mockListingData = {
    title: "Comprehensive MCAT Biology & Biochem Tutoring",
    category: "MCAT Prep",
    hourlyRate: 45,
    description: "Welcome to my tutoring session! I specialize in breaking down complex metabolic pathways and high-yield organ systems into intuitive, memorable concepts. We will utilize active recall, custom Anki decks, and AAMC-style practice question teardowns to ensure you feel confident on test day. Whether you are aiming for a content refresh or targeting a 130+ section score, our sessions will be tailored to your exact pacing and diagnostic needs.",
    tags: ["MCAT", "Biology", "Biochemistry", "Anki", "AAMC", "Test Strategies"],
    mentor: {
        displayName: "Sarah Jenkins",
        undergradMajor: "Neuroscience",
        mcat: "522",
        cgpa: "3.95",
        sgpa: "3.92"
    }
};

const ListingDetail = () => {

    // 2. Dummy event handler to test button wiring
    const handleBookNowClick = () => {
        alert("🎉 'Request Booking' button works! The BookingModal will trigger here.");
    };

    return (
        <div className="listing-detail-page">
            <div className="listing-detail-container">
                
                {/* Left Column: Product Details */}
                <div className="main-content">
                    <ServiceDetail 
                        title={mockListingData.title}
                        category={mockListingData.category}
                        hourlyRate={mockListingData.hourlyRate}
                        description={mockListingData.description}
                        tags={mockListingData.tags}
                    />

                    {/* Temporary visual box to make the page long enough to test scroll/sticky! */}
                    <div className="main-content-test-space">
                        <h4>🚧 Future Component Zone</h4>
                        <p>This empty space is here so you can scroll down and watch the MentorSidebar float smoothly on the right! Later, your ReviewSection and SimilarListings components will live here.</p>
                    </div>
                </div>

                {/* Right Column: Sticky Mentor Sidebar */}
                <div className="sidebar-content">
                    <MentorSidebar 
                        displayName={mockListingData.mentor.displayName}
                        undergradMajor={mockListingData.mentor.undergradMajor}
                        mcat={mockListingData.mentor.mcat}
                        cgpa={mockListingData.mentor.cgpa}
                        sgpa={mockListingData.mentor.sgpa}
                        onBookNow={handleBookNowClick}
                    />
                </div>

            </div>
        </div>
    );
};

export default ListingDetail;