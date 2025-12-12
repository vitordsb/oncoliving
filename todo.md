# OncoLiving - Project TODO

## Phase 1: Database Schema
- [x] Define users table with role field (PATIENT, ONCOLOGIST)
- [x] Define patient_profiles table
- [x] Define quizzes table
- [x] Define quiz_questions table with question types
- [x] Define quiz_question_options table
- [x] Define quiz_responses table
- [x] Define quiz_response_answers table
- [x] Define exercise_tutorials table
- [x] Define quiz_scoring_config table for configurable scoring rules
- [x] Run migrations with `pnpm db:push`

## Phase 2: Backend - Core Procedures
- [x] Implement auth.register procedure (patient signup)
- [x] Implement auth.login procedure
- [x] Implement auth.me procedure
- [x] Implement auth.logout procedure
- [x] Implement patients.list procedure (admin only)
- [x] Implement patients.getById procedure
- [x] Implement patients.updateProfile procedure
- [x] Implement quizzes.getActive procedure
- [x] Implement quizzes.create procedure (admin only)
- [x] Implement quizzes.update procedure (admin only)
- [x] Implement quizzes.list procedure (admin only)
- [x] Implement quizzes.getById procedure

## Phase 3: Backend - Quiz & Responses
- [x] Implement quizzes.questions.create procedure (admin only)
- [x] Implement quizzes.questions.update procedure (admin only)
- [x] Implement quizzes.questions.delete procedure (admin only)
- [x] Implement quizzes.responses.submitDaily procedure
- [x] Implement scoring logic based on weights and response values
- [x] Implement recommendation logic based on score ranges
- [x] Implement quizzes.responses.getMyHistory procedure
- [x] Implement quizzes.responses.getPatientHistory procedure (admin only)
- [x] Implement daily response validation (one per day per patient)

## Phase 4: Backend - Exercises
- [x] Implement exercises.list procedure
- [x] Implement exercises.create procedure (admin only)
- [x] Implement exercises.update procedure (admin only)
- [x] Implement exercises.delete procedure (admin only)
- [x] Implement exercises.getByIntensity procedure

## Phase 5: Backend - Reports & Analytics
- [ ] Implement reports.patientSummary procedure (admin only)
- [ ] Implement reports.getAdherenceStats procedure (admin only)
- [ ] Implement reports.getProgressTrend procedure (admin only)

## Phase 6: Seed Data
- [x] Create seed script with test oncologist
- [x] Create seed script with test patients
- [x] Create seed script with default quizzes
- [x] Create seed script with exercise tutorials
- [x] Create seed script with scoring configuration

## Phase 7: Frontend - Layout & Navigation
- [x] Create responsive layout component
- [x] Create navigation for patients
- [x] Create navigation for oncologists
- [x] Implement theme with blue/green color palette
- [x] Add global medical disclaimer notices

## Phase 8: Frontend - Authentication Pages
- [x] Create login page
- [x] Create patient registration page
- [x] Implement auth context and hooks
- [x] Implement protected routes

## Phase 9: Frontend - Patient Dashboard
- [x] Create patient dashboard page
- [x] Display today's quiz result (good/bad day + recommendation)
- [x] Display last 7 days summary with icons
- [x] Display weekly progress chart
- [x] Add button to start daily quiz
- [x] Add medical disclaimer

## Phase 10: Frontend - Quiz Flow
- [x] Create quiz page with question display
- [x] Implement progress bar (question X of Y)
- [x] Implement different question types (multiple choice, scale, yes/no)
- [x] Implement quiz submission
- [x] Display result with recommendation and exercise type
- [x] Handle daily response limit validation

## Phase 11: Frontend - History & Tutorials
- [x] Create history page with detailed past responses
- [x] Create tutorials/exercises page
- [x] Display exercise descriptions, intensity, and video links
- [x] Implement filtering by intensity level

## Phase 12: Frontend - Admin Dashboard
- [x] Create admin dashboard layout
- [x] Create patients management page (list, search, view profile)
- [ ] Create quiz configuration page
- [ ] Create exercise management page
- [ ] Create reports/analytics page
- [ ] Implement patient history viewer

## Phase 13: Frontend - Admin Quiz Editor
- [ ] Create quiz editor component
- [ ] Implement question type selector
- [ ] Implement weight/scoring configuration
- [ ] Implement question ordering
- [ ] Implement option management for multiple choice

## Phase 14: Frontend - Admin Exercise Manager
- [ ] Create exercise CRUD interface
- [ ] Implement intensity level selector
- [ ] Implement safety guidelines editor
- [ ] Implement video link management

## Phase 15: Testing
- [x] Write vitest for auth procedures
- [x] Write vitest for quiz submission and scoring
- [x] Write vitest for daily response validation
- [x] Write vitest for patient profile updates
- [x] Write vitest for admin procedures

## Phase 16: Final Review & Delivery
- [ ] Review all code quality
- [ ] Test responsive design on mobile
- [ ] Verify all medical disclaimers are visible
- [ ] Test complete user flows (patient and admin)
- [ ] Save checkpoint
- [ ] Deliver project to user
