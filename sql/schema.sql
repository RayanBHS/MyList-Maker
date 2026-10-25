-- ============================================================
-- MyList Maker - schéma de la base de données (MySQL / MariaDB)
-- Import direct :  mysql -u root -p < sql/schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS mylist_maker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mylist_maker;

-- On supprime dans l'ordre inverse des dépendances (permet de relancer le script)
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS to_do_list;
DROP TABLE IF EXISTS `user`;

-- ------------------------------------------------------------
-- User
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- session : un user a 0..n sessions, une session appartient à 1 user (1,1)
-- (le schéma ne donne pas d'attributs, on met le minimum utile)
-- ------------------------------------------------------------
CREATE TABLE session (
  id_session INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_user    INT UNSIGNED NOT NULL,
  token_hash CHAR(64)     NOT NULL,            -- SHA-256 du token envoyé au navigateur
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME     NOT NULL,
  PRIMARY KEY (id_session),
  UNIQUE KEY uq_session_token (token_hash),
  KEY idx_session_user (id_user),
  CONSTRAINT fk_session_user FOREIGN KEY (id_user)
    REFERENCES `user` (id_user) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- TO_DO_LIST : un user a 1..n listes (ajout de `color` pour le front)
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- Task : une liste a 1..n tâches (ajout de `location` et `flagged` pour le front)
-- ------------------------------------------------------------
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
