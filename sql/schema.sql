CREATE DATABASE IF NOT EXISTS mylist_maker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mylist_maker;


DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS to_do_list;
DROP TABLE IF EXISTS `user`;


CREATE TABLE `user` (
  id_user       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_user),
  UNIQUE KEY uq_user_username (username),
  UNIQUE KEY uq_user_email (email)
) ENGINE=InnoDB;


CREATE TABLE session (
  id_session INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_user    INT UNSIGNED NOT NULL,
  token_hash CHAR(64)     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NOT NULL,
  PRIMARY KEY (id_session),
  UNIQUE KEY uq_session_token (token_hash),
  KEY idx_session_user (id_user),
  CONSTRAINT fk_session_user FOREIGN KEY (id_user)
    REFERENCES `user` (id_user) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE to_do_list (
  id_list     INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_user     INT UNSIGNED NOT NULL,
  name        VARCHAR(100) NOT NULL,
  description TEXT NULL,
  color       VARCHAR(7)   NOT NULL DEFAULT '#3498db',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_list),
  KEY idx_list_user (id_user),
  CONSTRAINT fk_list_user FOREIGN KEY (id_user)
    REFERENCES `user` (id_user) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE task (
  id_task      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_list      INT UNSIGNED NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT NULL,
  status       ENUM('todo','doing','done')  NOT NULL DEFAULT 'todo',
  priority     ENUM('low','medium','high')  NOT NULL DEFAULT 'medium',
  due_date     DATE NULL,
  location     VARCHAR(255) NULL,
  flagged      TINYINT(1)   NOT NULL DEFAULT 0,
  position     INT UNSIGNED NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  PRIMARY KEY (id_task),
  KEY idx_task_list (id_list),
  KEY idx_task_due (due_date),
  CONSTRAINT fk_task_list FOREIGN KEY (id_list)
    REFERENCES to_do_list (id_list) ON DELETE CASCADE
) ENGINE=InnoDB;
