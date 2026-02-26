ALTER TABLE `media` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `media` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `media` ADD `completedAt` text;