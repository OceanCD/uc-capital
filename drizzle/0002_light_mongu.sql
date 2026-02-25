ALTER TABLE `users` ADD `stripe_customer_id` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_subscription_id` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_status` enum('free','pro','cancelled') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscription_ends_at` timestamp;