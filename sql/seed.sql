-- ============================================================
-- Données d'exemple (les mêmes que dans App.vue)
-- Import direct :  mysql -u root -p mylist_maker < sql/seed.sql
-- Compte de démo : demo / demo1234
-- ============================================================
USE mylist_maker;

INSERT INTO `user` (id_user, username, email, password_hash) VALUES
  (1, 'demo', 'demo@mylistmaker.local', '$2b$10$Fr/qN7Owwuwugr4vw96h7.aafg2XiyHNd1hIkR2w6AwuE9iNmMiUC');

INSERT INTO to_do_list (id_list, id_user, name, color) VALUES
  (1, 1, 'Web''s Work',   '#3498db'),
  (2, 1, 'Toronto Trip',  '#e74c3c'),
  (3, 1, 'Chores',        '#2ecc71');

INSERT INTO task (id_list, title, description, status, due_date, location, flagged, position, completed_at) VALUES
  (1, 'Starting Project', 'Do the milestone 1 and choose the subject of the project with the team', 'doing', CURDATE(), 'Concordia University', 1, 1, NULL),
  (1, 'First step of work', NULL, 'todo', NULL, NULL, 0, 2, NULL),
  (1, 'Work together at Concordia', NULL, 'todo', NULL, 'Concordia University', 0, 3, NULL),
  (1, 'New ideas for the project', NULL, 'done', NULL, NULL, 0, 4, NOW()),
  (2, 'Go to the Niagara falls', 'Take the bus from Toronto', 'todo', NULL, 'Niagara Falls', 1, 1, NULL),
  (2, 'Return to Paris', NULL, 'todo', NULL, 'Paris', 1, 2, NULL),
  (3, 'Do the groceries', 'milk, eggs, bread', 'todo', CURDATE(), NULL, 0, 1, NULL);
