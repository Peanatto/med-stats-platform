-- ==============================================================================
-- MED STATS MENTORSHIP MARKETPLACE - MASTER SCHEMA
-- ==============================================================================

-- 1. Wipe the slate clean (Ordered specifically to avoid Foreign Key conflicts)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS service_listings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- CORE AUTHENTICATION
-- ==============================================================================

-- Table 1: The Private User Account
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NULL, -- Nullable for Google OAuth users
    auth_provider VARCHAR(20) DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin')),
    is_verified_med_student BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- USER PROFILES (Credentials & Advice)
-- ==============================================================================

-- Table 2: The Public Profile (Identity, Academic Stats & Advice)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    display_name VARCHAR(50) UNIQUE NOT NULL,
    profile_type VARCHAR(20) DEFAULT 'premed', 
    
    undergrad_major VARCHAR(100) NOT NULL,
    
    cumulative_gpa NUMERIC(3, 2),   -- Nullable fields (Pre-meds can leave them blank until accepted)
    science_gpa NUMERIC(3, 2),
    mcat_score INTEGER CHECK (mcat_score BETWEEN 472 AND 528),
    
    clinical_hours INTEGER DEFAULT 0,
    research_hours INTEGER DEFAULT 0,
    shadowing_hours INTEGER DEFAULT 0,
    volunteer_hours INTEGER DEFAULT 0,
    
    advice_snippet TEXT, 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- ==============================================================================
-- THE SHARING ECONOMY (Mentorship Marketplace)
-- ==============================================================================

-- Table 3: The Shared Items (Tutoring & Mentorship Offerings)
CREATE TABLE service_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL, -- Links to the Medical Student's user account
    title VARCHAR(255) NOT NULL, -- e.g., "1-on-1 MCAT Strategy & Schedule Planning"
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., "MCAT Prep", "Personal Statement", "Mock Interview"
    hourly_rate NUMERIC(6, 2) NOT NULL DEFAULT 0.00, -- Can be $0.00 for volunteer mentoring!
    tags TEXT[], -- e.g., '{"Biology", "Zoom", "Evenings"}'
    
    is_active BOOLEAN DEFAULT TRUE, -- Allows tutors to pause listings during exam weeks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Table 4: The Transaction (Bookings & Appointments)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL,
    client_id UUID NOT NULL, -- Links to the Pre-med student
    provider_id UUID NOT NULL, -- Links to the Med student (copied here for easy dashboard querying)
    
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    client_notes TEXT, -- e.g., "I am struggling with CARS timing and need tips."
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES service_listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_provider FOREIGN KEY (provider_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Table 5: Rating & Commenting (Verified Airbnb-Style Reviews)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE NOT NULL, -- UNIQUE ensures only ONE review per completed session!
    listing_id UUID NOT NULL,
    reviewer_id UUID NOT NULL, -- The Pre-med student
    
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,
    CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES service_listings (id) ON DELETE CASCADE,
    CONSTRAINT fk_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE
);