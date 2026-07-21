// src/data/mockUser.js
export const mockUser = {
  id: "user-001",
  displayName: "MedMentor_2026",
  undergradMajor: "Neuroscience",
  avatarUrl: null, // Null triggers privacy-friendly fallback
  
  // Academic Metrics (For Tab 1: Profile Settings)
  cgpa: 3.92,
  sgpa: 3.88,
  mcat: 518,
  
  // Extracurricular Hours
  clinicalHours: 1200,
  researchHours: 600,
  shadowingHours: 100,
  volunteerHours: 350,
  
  // Lightweight Mentorship Bio
  adviceSnippet: "Focus on understanding metabolic pathways conceptually rather than rote memorization. It saves hours of Anki time!"
};