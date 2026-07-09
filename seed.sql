-- 1. Create two users (We manually assign the UUIDs so we can reference them)
INSERT INTO users (id, email, password_hash, is_verified_med_student)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'student1@university.edu', 'hashed_pass_1', TRUE),
    ('22222222-2222-2222-2222-222222222222', 'applicant2@gmail.com', 'hashed_pass_2', FALSE);

-- 2. Create their public profiles using those exact same IDs as the user_id
INSERT INTO stats_profiles (user_id, display_name, undergrad_major, cumulative_gpa, science_gpa, mcat_score, clinical_hours, advice_text)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'FutureDoc_99', 'Biology', 3.85, 3.80, 515, 1200, 'Consistency is key. Do Anki daily.'),
    ('22222222-2222-2222-2222-222222222222', 'Anonymous_Owl_45', 'Chemistry', 3.92, 3.95, 520, 450, 'Don''t neglect your clinical hours!');
    
----- MCAT Score Validation Test

-- Expected Error: new row for relation "stats_profiles" violates check constraint
INSERT INTO stats_profiles (user_id, display_name, undergrad_major, cumulative_gpa, science_gpa, mcat_score)
VALUES ('11111111-1111-1111-1111-111111111111', 'Genius_Applicant', 'Physics', 4.00, 4.00, 600);

----- Foreign Key Constraint Test

-- Expected Error: insert or update on table "stats_profiles" violates foreign key constraint
INSERT INTO stats_profiles (user_id, display_name, undergrad_major, cumulative_gpa, science_gpa, mcat_score)
VALUES ('99999999-9999-9999-9999-999999999999', 'Ghost_User', 'English', 3.50, 3.40, 505);

----- Username Copy Protection Test

-- First, we need a valid 3rd user to attach this to
INSERT INTO users (id, email, password_hash)
VALUES ('33333333-3333-3333-3333-333333333333', 'thief@gmail.com', 'pass3');

-- Expected Error: duplicate key value violates unique constraint
INSERT INTO stats_profiles (user_id, display_name, undergrad_major, cumulative_gpa, science_gpa, mcat_score)
VALUES ('33333333-3333-3333-3333-333333333333', 'FutureDoc_99', 'Math', 3.70, 3.65, 510);

----- Null Value Constraint Test

-- Expected Error: null value in column "undergrad_major" violates not-null constraint
INSERT INTO stats_profiles (user_id, display_name, cumulative_gpa, science_gpa, mcat_score)
VALUES ('33333333-3333-3333-3333-333333333333', 'Forgetful_Premed', 3.60, 3.50, 508);

SELECT * FROM users;
SELECT * FROM stats_profiles;