import React from 'react';
import { useState } from 'react';
import ServiceDetail from '../../components/listings/ServiceDetail';
import MentorSidebar from '../../components/listings/MentorSidebar';
import ReviewSection from '../../components/reviews/ReviewSection';
import SimilarListings from '../../components/listings/SimilarListings';
import BookingModal from '../../components/modals/BookingModal';
import './ListingDetail.css';

// Primary Listing Data
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

// Mock Reviews Array for ReviewSection
const mockReviewsArray = [
    {
        id: "rev-1",
        reviewerId: "user-101",
        displayName: "David M.",
        major: "Biology Major",
        date: "2 weeks ago",
        rating: 5,
        comment: "Sarah is an absolute lifesaver! I was struggling to memorize the metabolic pathways for Biochem, but her custom Anki decks and visual mnemonics made everything click. My section score jumped 4 points on my last AAMC practice exam!"
    },
    {
        id: "rev-2",
        reviewerId: "user-102",
        displayName: "Elena R.",
        major: "Psychology Major",
        date: "1 month ago",
        rating: 5,
        comment: "Incredibly patient and organized. She doesn't just give you the answers; she teaches you how to dissect the AAMC passage experiments step-by-step. Worth every penny."
    },
    {
        id: "rev-3",
        reviewerId: "user-103",
        displayName: "Marcus T.",
        major: "Post-Baccalaureate",
        date: "2 months ago",
        rating: 4,
        comment: "Great session focused heavily on high-yield organ systems. She helped me identify my weak spots in endocrine physiology quickly. Highly recommend for targeted content review!"
    }
];

// Mock Similar Listings Array (Structured identically to ServiceCard props)
const mockSimilarListings = [
    {
        id: "sim-1",
        title: "Intensive CARS & Reading Comprehension Strategy",
        category: "MCAT Prep",
        hourlyRate: 40,
        rating: 4.9,
        reviewCount: 14,
        displayName: "Alex Chen",
        undergradMajor: "Philosophy & English",
        mcat: "524",
        cgpa: "3.88",
        sgpa: "3.80",
        clinicalHours: 450,
        researchHours: 200,
        shadowingHours: 80,
        volunteerHours: 300,
        adviceSnippet: "CARS isn't about outside knowledge; it's about understanding the author's underlying architecture and tone."
    },
    {
        id: "sim-2",
        title: "High-Yield Organic Chemistry & Reaction Mechanisms",
        category: "MCAT Prep",
        hourlyRate: 50,
        rating: 5.0,
        reviewCount: 22,
        displayName: "Priya Patel",
        undergradMajor: "Biochemistry",
        mcat: "520",
        cgpa: "3.98",
        sgpa: "3.96",
        clinicalHours: 600,
        researchHours: 850,
        shadowingHours: 120,
        volunteerHours: 150,
        adviceSnippet: "Stop memorizing organic reactions! Focus on nucleophiles, electrophiles, and electron flow."
    },
    {
        id: "sim-3",
        title: "General Chemistry & Physics Formula Mastery",
        category: "MCAT Prep",
        hourlyRate: 35,
        rating: 4.8,
        reviewCount: 9,
        displayName: "Jordan Taylor",
        undergradMajor: "Biomedical Engineering",
        mcat: "518",
        cgpa: "3.75",
        sgpa: "3.82",
        clinicalHours: 300,
        researchHours: 400,
        shadowingHours: 50,
        volunteerHours: 500,
        adviceSnippet: "Dimensional analysis and unit tracking can save you on half of the Chem/Phys math calculations."
    }
];

const ListingDetail = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookNowClick = (mentorData) => {
        setIsModalOpen(true);
    };

    return (
        <div className="listing-detail-page">
            
            {/* TOP SECTION: 2-Column Grid */}
            <div className="listing-detail-container">
                
                {/* Left Column: Product Details & Reviews */}
                <div className="main-content">
                    <ServiceDetail 
                        title={mockListingData.title}
                        category={mockListingData.category}
                        hourlyRate={mockListingData.hourlyRate}
                        description={mockListingData.description}
                        tags={mockListingData.tags}
                    />

                    {/* Swapped out the old temporary test space for ReviewSection */}
                    <ReviewSection 
                        reviews={mockReviewsArray} 
                        averageRating="4.9" 
                    />
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

            {/* BOTTOM SECTION: Full-Width Outside the 2-Column Grid */}
            <div className="full-width-bottom-section">
                <SimilarListings similarListings={mockSimilarListings} />
            </div>

            {/* Floating Modal Overlay */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mentorName={mockListingData.mentor.displayName}
                hourlyRate={mockListingData.hourlyRate}
            />

        </div>
    );
};

export default ListingDetail;