-- create test database
CREATE DATABASE IF NOT EXISTS fake_jira_test;

-- create test user
CREATE USER IF NOT EXISTS 'testuser123'@'%' IDENTIFIED BY '1356789test';
GRANT ALL ON fake_jira_test.* TO 'testuser123'@'%';
FLUSH PRIVILEGES;
