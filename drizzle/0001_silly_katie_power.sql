CREATE TABLE `exercise_tutorials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`intensityLevel` enum('LIGHT','MODERATE','STRONG') NOT NULL,
	`safetyGuidelines` text,
	`videoLink` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exercise_tutorials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patient_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mainDiagnosis` text,
	`treatmentStage` varchar(100),
	`dateOfBirth` timestamp,
	`gender` varchar(20),
	`observations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patient_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `quiz_question_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`scoreValue` decimal(5,2) NOT NULL,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_question_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`text` text NOT NULL,
	`questionType` enum('YES_NO','SCALE_0_10','MULTIPLE_CHOICE') NOT NULL,
	`weight` decimal(5,2) NOT NULL DEFAULT '1.00',
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_response_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`responseId` int NOT NULL,
	`questionId` int NOT NULL,
	`answerValue` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_response_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`quizId` int NOT NULL,
	`responseDate` timestamp NOT NULL,
	`totalScore` decimal(8,2) NOT NULL,
	`isGoodDayForExercise` boolean NOT NULL,
	`recommendedExerciseType` varchar(100) NOT NULL,
	`generalObservations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_scoring_config` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quizId` int NOT NULL,
	`minScore` decimal(8,2) NOT NULL,
	`maxScore` decimal(8,2) NOT NULL,
	`isGoodDay` boolean NOT NULL,
	`recommendedExerciseType` varchar(100) NOT NULL,
	`exerciseDescription` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_scoring_config_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `email` varchar(320) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('PATIENT','ONCOLOGIST') NOT NULL DEFAULT 'PATIENT';--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);