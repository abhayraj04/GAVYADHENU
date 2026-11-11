CREATE TABLE `payouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`orderId` int,
	`amount` decimal(12,2) NOT NULL,
	`status` enum('pending','processing','paid','failed') NOT NULL DEFAULT 'pending',
	`providerReference` varchar(120),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`paidAt` timestamp,
	CONSTRAINT `payouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`orderId` int,
	`rating` int NOT NULL,
	`title` varchar(160),
	`body` text,
	`status` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `payouts_seller_idx` ON `payouts` (`sellerId`);--> statement-breakpoint
CREATE INDEX `payouts_status_idx` ON `payouts` (`status`);--> statement-breakpoint
CREATE INDEX `reviews_product_idx` ON `reviews` (`productId`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`userId`);