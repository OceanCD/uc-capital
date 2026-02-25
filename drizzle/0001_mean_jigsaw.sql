CREATE TABLE `daily_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(32) NOT NULL,
	`sentiment_score` int NOT NULL,
	`sentiment_label` varchar(32) NOT NULL,
	`sentiment_summary` text NOT NULL,
	`sentiment_data` json NOT NULL,
	`fundamentals_summary` text NOT NULL,
	`fundamentals_highlights` json NOT NULL,
	`technicals_summary` text NOT NULL,
	`technicals_levels` json NOT NULL,
	`weekly_outlook` varchar(32) NOT NULL,
	`weekly_summary` text NOT NULL,
	`weekly_events` json NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_analysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(32) NOT NULL,
	`name` varchar(64) NOT NULL,
	`value` varchar(32) NOT NULL,
	`change` varchar(16) NOT NULL,
	`is_up` boolean NOT NULL DEFAULT true,
	`sparkline` json NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `market_indices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`time` varchar(16) NOT NULL,
	`tier` enum('宏观','产业','行业','个股') NOT NULL,
	`title` text NOT NULL,
	`source` varchar(64) NOT NULL,
	`sentiment` enum('positive','negative','neutral') NOT NULL,
	`transmission_chain` json NOT NULL,
	`stock_impact` json NOT NULL,
	`published_at` timestamp NOT NULL DEFAULT (now()),
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `news_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_holdings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(16) NOT NULL,
	`name` varchar(128) NOT NULL,
	`weight` varchar(16) NOT NULL,
	`shares` int NOT NULL,
	`avg_cost` varchar(32) NOT NULL,
	`current_price` varchar(32) NOT NULL,
	`gain_loss` varchar(16) NOT NULL,
	`gain_loss_percent` varchar(16) NOT NULL,
	`is_up` boolean NOT NULL DEFAULT true,
	`sector` varchar(64) NOT NULL,
	`pe` varchar(16) NOT NULL,
	`pb` varchar(16) NOT NULL,
	`market_cap` varchar(32) NOT NULL,
	`narrative` text NOT NULL,
	`earnings` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_holdings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` varchar(16) NOT NULL,
	`uc_capital` varchar(16) NOT NULL,
	`spy` varchar(16) NOT NULL,
	`qqq` varchar(16) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `portfolio_performance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(16) NOT NULL,
	`name` varchar(128) NOT NULL,
	`price` varchar(32) NOT NULL,
	`change` varchar(16) NOT NULL,
	`is_up` boolean NOT NULL DEFAULT true,
	`volume` varchar(32) NOT NULL,
	`pe` varchar(16) NOT NULL,
	`pb` varchar(16) NOT NULL,
	`market_cap` varchar(32) NOT NULL,
	`narrative` text NOT NULL,
	`earnings` text NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `stocks_symbol_unique` UNIQUE(`symbol`)
);
