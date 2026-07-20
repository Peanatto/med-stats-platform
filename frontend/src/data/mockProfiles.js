// src/data/mockProfiles.js
export const mockProfiles = [
  {
    id: '1',
    displayName: 'FutureDoc_99',
    undergradMajor: 'Biology',
    title: '1-on-1 MCAT Strategy & Comprehensive Schedule Planning',
    category: 'MCAT Tutoring',
    hourlyRate: 35,
    rating: 4.9,
    reviewCount: 24,
    cgpa: 3.85,
    sgpa: 3.80,
    mcat: 515,
    clinicalHours: 1200,
    researchHours: 400,
    shadowingHours: 50,
    volunteerHours: 150,
    adviceSnippet: 'Consistency beats intensity every time. Treat Anki like brushing your teeth—do it daily without fail.',
    
    // Deep Listing Data
    description: 'Struggling to balance CARS practice with content review? In these 1-on-1 sessions, we will build a customized, day-by-day study schedule tailored to your exam date. I specialize in identifying high-yield weaknesses and teaching you how to dissect AAMC passage logic without getting bogged down by extraneous details.',
    tags: ['MCAT', 'Study Schedules', 'Anki', 'Biology', 'CARS'],
    reviews: [
      {
        id: 'rev-1-1',
        reviewerId: 'user-201',
        displayName: 'Kevin L.',
        major: 'Biochemistry',
        date: '1 week ago',
        rating: 5,
        comment: 'Helped me completely restructure my last 6 weeks of study. My practice scores stabilized immediately!'
      },
      {
        id: 'rev-1-2',
        reviewerId: 'user-202',
        displayName: 'Samantha P.',
        major: 'Biology',
        date: '3 weeks ago',
        rating: 5,
        comment: 'Super practical advice on how to use Anki efficiently without spending 4 hours a day on reviews.'
      }
    ]
  },
  {
    id: '2',
    displayName: 'Anonymous_Owl_45',
    undergradMajor: 'Chemistry',
    title: 'Personal Statement Brainstorming & Narrative Review',
    category: 'Personal Statement',
    hourlyRate: 0, 
    rating: 5.0,
    reviewCount: 11,
    cgpa: 3.92,
    sgpa: 3.95,
    mcat: 520,
    clinicalHours: 450,
    researchHours: 1200,
    shadowingHours: 100,
    volunteerHours: 200,
    adviceSnippet: 'Don\'t try to fit a mold. Admissions committees can smell inauthenticity from a mile away; write about what actually moves you.',
    
    // Deep Listing Data
    description: 'Your personal statement should tell a cohesive story about why medicine is your calling, not just list your resume in paragraph form. As a free volunteer service, I will review your drafts, assist with brainstorming core themes, and provide line-by-line feedback on tone, structure, and emotional impact.',
    tags: ['Personal Statement', 'Writing', 'AMCAS', 'Editing', 'Mentorship'],
    reviews: [
      {
        id: 'rev-2-1',
        reviewerId: 'user-203',
        displayName: 'Chloe M.',
        major: 'English & Pre-Med',
        date: '2 days ago',
        rating: 5,
        comment: 'Incredible eye for detail. She helped me turn a disjointed draft into a powerful narrative.'
      }
    ]
  },
  {
    id: '3',
    displayName: 'NonTrad_Engineer',
    undergradMajor: 'Biomedical Engineering',
    title: 'Rigorous Mock MMI Interview Practice & Ethics Review',
    category: 'Mock Interview',
    hourlyRate: 45,
    rating: 4.8,
    reviewCount: 19,
    cgpa: 3.65,
    sgpa: 3.60,
    mcat: 518,
    clinicalHours: 2000,
    researchHours: 0,
    shadowingHours: 80,
    volunteerHours: 500,
    adviceSnippet: 'Being a non-traditional applicant is a superpower, not a weakness. Lean heavily into your real-world problem-solving experience.',
    
    // Deep Listing Data
    description: 'Multiple Mini Interviews (MMIs) can be intimidating, but they follow predictable ethical and communication frameworks. We will run timed, realistic mock stations covering medical ethics, healthcare policy, and behavioral scenarios, followed by actionable debriefs to refine your delivery.',
    tags: ['MMI', 'Mock Interview', 'Medical Ethics', 'Non-Traditional', 'Public Speaking'],
    reviews: [
      {
        id: 'rev-3-1',
        reviewerId: 'user-204',
        displayName: 'Marcus B.',
        major: 'Mechanical Engineering',
        date: '1 month ago',
        rating: 5,
        comment: 'As an older applicant, his advice on how to frame my career transition was invaluable. Highly recommend!'
      }
    ]
  },
  {
    id: '4',
    displayName: 'Dr_Empathy',
    undergradMajor: 'Psychology',
    title: 'General Pre-Med Advising & School List Curation',
    category: 'General Mentorship',
    hourlyRate: 20,
    rating: 4.7,
    reviewCount: 8,
    cgpa: 3.78,
    sgpa: 3.72,
    mcat: 512,
    clinicalHours: 800,
    researchHours: 300,
    shadowingHours: 120,
    volunteerHours: 600,
    adviceSnippet: 'Protect your mental health during the application cycle. You cannot pour from an empty cup!',
    
    // Deep Listing Data
    description: 'Building a realistic, data-driven school list is one of the most critical steps in avoiding a re-applicant cycle. Together, we will analyze your stats, clinical hours, and regional preferences to categorize schools into reach, target, and baseline options while building a stress-reduction strategy for the cycle.',
    tags: ['School List', 'Advising', 'Mental Health', 'Application Strategy'],
    reviews: []
  }
];