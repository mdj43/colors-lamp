CREATE DATABASE `colors_database`;
USE `colors_database`;

CREATE TABLE `users`(
    `id`         INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL DEFAULT '',
    `last_name`  VARCHAR(50) NOT NULL DEFAULT '',
    `username`   VARCHAR(50) NOT NULL DEFAULT '',
    `password`   VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;

CREATE TABLE `colors`(
    `id`      INTEGER NOT NULL UNIQUE AUTO_INCREMENT,
    `name`    VARCHAR(50) NOT NULL DEFAULT '',
    'user_id' INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;