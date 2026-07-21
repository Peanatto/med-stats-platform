// src/data/mockBookings.js
export const mockBookings = [
  {
    id: "book-101",
    mentorId: "user-001", // User is the MED STUDENT here
    studentId: "user-099",
    studentName: "Alex R.",
    mentorName: "MedMentor_2026",
    studentMajor: "Biomedical Engineering",
    serviceTitle: "MCAT Biochemistry Passage Walkthroughs",
    date: "July 24, 2026",
    time: "2:00 PM - 3:00 PM PDT",
    hourlyRate: 45,
    status: "Pending",
    notes: "Struggling with enzyme kinetics questions. Would love some tips on reading graphs faster!"
  },
  {
    id: "book-102",
    mentorId: "mentor-888", 
    studentId: "user-001", // User is the PRE-MED STUDENT here
    studentName: "MedMentor_2026",
    mentorName: "Dr. Dave (MS3)",
    studentMajor: "Neuroscience",
    serviceTitle: "Medical School Personal Statement Review",
    date: "July 28, 2026",
    time: "5:00 PM - 6:00 PM PDT",
    hourlyRate: 60,
    status: "Pending",
    notes: "I attached my second draft. Really looking for feedback on my introductory paragraph!"
  },
  {
    id: "book-103",
    mentorId: "mentor-555", 
    studentId: "user-001", // User is the PRE-MED STUDENT here!
    studentName: "MedMentor_2026",
    mentorName: "Sarah J. (MS2)",
    studentMajor: "Neuroscience",
    serviceTitle: "CARs Strategy & Timed Practice Session",
    date: "July 15, 2026",
    time: "1:00 PM - 2:00 PM PDT",
    hourlyRate: 40,
    status: "Completed",
    notes: "Need help staying paced during difficult philosophy passages."
  }
];