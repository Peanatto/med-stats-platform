// prisma/seed.js
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Wiping old database records...");

    // Wipe data in reverse dependency order
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.serviceListing.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    console.log("Database wiped! Seeding new test users...");

    // Create a Student Account
    const student = await prisma.user.create({
        data: {
            email: "student@university.edu",
            passwordHash: "password123", // Set a standard password for testing
            role: "student",
            profile: {
                create: {
                    displayName: "PreMed_Pro",
                    profileType: "pre_med",
                    undergradMajor: "Biochemistry",
                }
            }
        }
    });

    // Create a Mentor Account with Listings
    const mentor = await prisma.user.create({
        data: {
            email: "mentor@medschool.edu",
            passwordHash: "password123", 
            role: "mentor",
            isVerifiedMedStudent: true,
            profile: {
                create: {
                    displayName: "Dr. Future (M3)",
                    profileType: "med_student",
                    undergradMajor: "Biology",
                    cumulativeGpa: 3.92,
                    scienceGpa: 3.89,
                    mcatScore: 518,
                    clinicalHours: 1200,
                    researchHours: 800,
                    shadowingHours: 150,
                    volunteerHours: 300,
                    adviceSnippet: "Start CARS practice early and don't neglect your extracurriculars!"
                }
            },
            serviceListings: {
                create: [
                    {
                        title: "1-on-1 MCAT Strategy & Schedule Planning",
                        description: "I will help you build a comprehensive, day-by-day MCAT study schedule tailored to your weaknesses.",
                        category: "MCAT Prep",
                        hourlyRate: 25.00,
                        tags: ["MCAT", "Scheduling", "Zoom"],
                        isActive: true
                    }
                ]
            }
        }
    });

    console.log("=========================================");
    console.log("Seeding complete! Test accounts created:");
    console.log("Mentor: mentor@medschool.edu | Pass: password123");
    console.log("Student: student@university.edu | Pass: password123");
    console.log("=========================================");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });