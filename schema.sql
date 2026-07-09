DROP TABLE IF EXISTS stats_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID generation in PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: The Private User Account
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Assuming email/password auth for now
    is_verified_med_student BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: The Public Medical Stats Profile
CREATE TABLE stats_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL, -- UNIQUE ensures one profile per user
    display_name VARCHAR(50) UNIQUE NOT NULL,

    undergrad_major VARCHAR(100) NOT NULL,
    cumulative_gpa NUMERIC(3, 2) NOT NULL, -- e.g., 3.95
    science_gpa NUMERIC(3, 2) NOT NULL,
    mcat_score INTEGER NOT NULL CHECK (mcat_score BETWEEN 472 AND 528),

    clinical_hours INTEGER DEFAULT 0,
    research_hours INTEGER DEFAULT 0,
    shadowing_hours INTEGER DEFAULT 0,
    volunteer_hours INTEGER DEFAULT 0,

    advice_text TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users (id)
        ON DELETE CASCADE -- If a user deletes their account, delete their profile too
);