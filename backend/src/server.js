// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Setup Prisma with the PostgreSQL Adapter
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Mentorship API is running!');
});

// ==========================================
// MARKETPLACE ROUTES
// ==========================================

// Fetch ALL Listings (For Search.jsx)
app.get('/api/listings', async (req, res) => {
    try {
        const listings = await prisma.serviceListing.findMany({
            where: { isActive: true },
            include: {
                provider: {
                    include: {
                        profile: true 
                    }
                },
                reviews: true 
            }
        });

        const formattedListings = listings.map(listing => {
            const avgRating = listing.reviews.length > 0 
                ? (listing.reviews.reduce((acc, rev) => acc + rev.rating, 0) / listing.reviews.length).toFixed(1)
                : 0;

            return {
                id: listing.id,
                title: listing.title,
                category: listing.category,
                hourlyRate: listing.hourlyRate,
                tags: listing.tags,
                
                displayName: listing.provider.profile.displayName,
                undergradMajor: listing.provider.profile.undergradMajor,
                cgpa: listing.provider.profile.cumulativeGpa,
                sgpa: listing.provider.profile.scienceGpa,
                mcat: listing.provider.profile.mcatScore,
                clinicalHours: listing.provider.profile.clinicalHours,
                researchHours: listing.provider.profile.researchHours,
                shadowingHours: listing.provider.profile.shadowingHours,
                volunteerHours: listing.provider.profile.volunteerHours,
                adviceSnippet: listing.provider.profile.adviceSnippet,
                
                rating: Number(avgRating),
                reviewCount: listing.reviews.length
            };
        });

        res.json(formattedListings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch marketplace listings" });
    }
});

// Fetch a single Listing (For ListingDetail.jsx)
app.get('/api/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await prisma.serviceListing.findUnique({
            where: { id: id },
            include: {
                provider: {
                    include: { profile: true }
                },
                reviews: {
                    include: { reviewer: true } 
                }
            }
        });

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        res.json(listing); 
    } catch (error) {
        console.error("Error fetching listing details:", error);
        res.status(500).json({ error: "Failed to fetch listing details" });
    }
});

// ==========================================
// TRANSACTIONS & INTERACTIONS
// ==========================================

// Create a Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { client_id, provider_id, listing_id, topic, date_time, duration, notes, total_cost } = req.body;

        const newBooking = await prisma.booking.create({
            data: {
                clientId: client_id,
                providerId: provider_id,
                listingId: listing_id,
                topic: topic,
                dateTime: new Date(date_time), 
                duration: duration,
                notes: notes,
                totalCost: total_cost,
                status: 'Pending' 
            }
        });

        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

// Create a Review
app.post('/api/reviews', async (req, res) => {
    try {
        const { listing_id, client_id, rating, comment } = req.body;

        // Find the student's most recent booking for this specific listing
        const pastBooking = await prisma.booking.findFirst({
            where: {
                listingId: listing_id,
                clientId: client_id
            },
            orderBy: {
                createdAt: 'desc' // Grabs the newest booking to attach the review to
            }
        });

        // Auth Check: Block the review if they haven't actually booked this mentor yet
        if (!pastBooking) {
            return res.status(403).json({ 
                error: "You must book a session with this mentor before leaving a review." 
            });
        }

        // Create the review using the automatically retrieved booking ID
        const newReview = await prisma.review.create({
            data: {
                listingId: listing_id,
                reviewerId: client_id, 
                bookingId: pastBooking.id,
                rating: Number(rating),
                comment: comment
            },
            include: {
                reviewer: true 
            }
        });

        const formattedReview = {
            id: newReview.id,
            listingId: newReview.listingId,
            authorName: newReview.reviewer.displayName || "Student", 
            authorId: newReview.reviewerId,
            rating: newReview.rating,
            date: newReview.createdAt.toISOString().split('T')[0],
            comment: newReview.comment
        };

        res.status(201).json(formattedReview);
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ error: "Failed to submit review" });
    }
});

// ==========================================
// DASHBOARD & USER MANAGEMENT ROUTES
// ==========================================

// Update User Profile
app.put('/api/users/:id/profile', async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName, undergradMajor, cgpa, sgpa, mcat, clinicalHours, researchHours, shadowingHours, volunteerHours, adviceSnippet } = req.body;

        const updatedProfile = await prisma.profile.update({
            where: { userId: id }, 
            data: {
                displayName, undergradMajor, 
                cumulativeGpa: cgpa, scienceGpa: sgpa, mcatScore: mcat, 
                clinicalHours, researchHours, volunteerHours, shadowingHours,
                adviceSnippet
            }
        });
        res.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).jason({ error: "Failed to update profile" });
    }
});

// Get Listings for a Specific User
app.get('/api/users/:id/listings', async (req, res) => {
    try {
        const { id } = req.params;
        const userListings = await prisma.serviceListing.findMany({
            where: { providerId: id }, 
            orderBy: { createdAt: 'desc' }
        });
        res.json(userListings);
    } catch (error) {
        console.error("Error fetching user listings:", error);
        res.status(500).json({ error: "Failed to fetch your listings" });
    }
});

// Create a New Listing
app.post('/api/listings', async (req, res) => {
    try {
        const { providerId, title, description, category, hourlyRate, tags } = req.body;
        const newListing = await prisma.serviceListing.create({
            data: {
                providerId, title, description, category, 
                hourlyRate: Number(hourlyRate), 
                tags: tags || [], 
                isActive: true
            }
        });
        res.status(201).json(newListing);
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Failed to create listing" });
    }
});

// Update Existing Listing
app.put('/api/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, hourlyRate, tags } = req.body;
        const updatedListing = await prisma.serviceListing.update({
            where: { id: id }, 
            data: { title, description, category, hourlyRate: Number(hourlyRate), tags }
        });
        res.json(updatedListing);
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ error: "Failed to update listing" });
    }
});

// Toggle Listing Status (Pause/Unhide)
app.patch('/api/listings/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const updatedListing = await prisma.serviceListing.update({
            where: { id: id },
            data: { isActive: Boolean(isActive) }
        });
        res.json(updatedListing);
    } catch (error) {
        console.error("Error toggling listing status:", error);
        res.status(500).json({ error: "Failed to update listing status" });
    }
});

// Delete a Listing
app.delete('/api/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.serviceListing.delete({ where: { id: id } });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ error: "Failed to delete listing" });
    }
});

// Get Bookings for a Specific User (Both as Client and Provider)
app.get('/api/users/:id/bookings', async (req, res) => {
    try {
        const { id } = req.params;
        const userBookings = await prisma.booking.findMany({
            where: {
                OR: [ { clientId: id }, { providerId: id } ]
            },
            include: {
                listing: true,
                client: { include: { profile: true } },
                provider: { include: { profile: true } }
            },
            orderBy: { dateTime: 'asc' }
        });
        res.json(userBookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// Update Booking Status (Confirm/Decline)
app.patch('/api/bookings/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // e.g., 'Confirmed', 'Declined', 'Completed'
        const updatedBooking = await prisma.booking.update({
            where: { id: id },
            data: { status: status }
        });
        res.json(updatedBooking);
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({ error: "Failed to update booking status" });
    }
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register a New User
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        // Hash password using 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the User and their connected Profile simultaneously
        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role,
                profile: {
                    create: {
                        // Use the first part of the email as a temporary display name
                        displayName: email.split('@')[0], 
                        profileType: role === 'mentor' ? 'med_student' : 'pre_med',
                        undergradMajor: 'Undeclared', 
                    }
                }
            },
            // Return the full nested object back to the React context
            include: { profile: true } 
        });

        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Failed to register account." });
    }
});

// Login Existing User
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user and fetch their profile stats
        const user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        });

        // Validate existence
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // Check if account was created with Google OAuth
        if (user.authProvider === 'google' && !user.passwordHash) {
            return res.status(400).json({ error: "Please sign in using Google." });
        }

        // Compare plain-text pass with stored bcrypt hash
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        res.json({ user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Failed to log in." });
    }
});

// Google OAuth Verification
app.post('/api/auth/google', async (req, res) => {
    const { credential } = req.body;

    try {
        // Cryptographically verify token directly with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user already exists in DB
        let user = await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });

        // Create new Google-authenticated user if they don't exist
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    authProvider: 'google',
                    passwordHash: null,
                    profile: {
                        create: {
                            displayName: name || email.split('@')[0],
                            profileType: 'pre_med', // Defaulting to pre_med for Google signups
                            undergradMajor: 'Undeclared', 
                        },
                    },
                },
                include: { profile: true },
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Google authentication failed.' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Marketplace Backend running on http://localhost:${PORT}`);
});