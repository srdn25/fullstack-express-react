## Task:
You need to develop a web application for task management. The application should allow
users to create new tasks, view existing tasks, and mark completed tasks.
The application should include the following pages:
- [x] Task creation page
- [x] Task list viewing page
- [ ] Modal window with detailed information about the task (not page)
The task creation page should have fields for entering the task title, description, and due date.
The task list viewing page should display all tasks sorted by due date (the closest tasks should
be at the top).
When clicking on a task in the list, the detailed task information modal should open, which
displays the task title, description, and due date. Also, on the detailed task information modal,
there should be an option to mark the task as completed.

## Tech stack:
Backend: JS, Node, Express, MySQL, WebSocket;

Frontend: JS, TS, React, Material-UI, WebSocket, state management(any).

## Evaluation of completed task:
The evaluation of the completed task will be based on the following criteria:

**Application functionality:** all requirements described above must be implemented, and the
application must work without errors.

**Code quality:** the code should be clean, understandable, well-structured, and must comply with
modern web development standards.

**Design and user interface:** the application should have a pleasant and intuitive design that
provides convenient user interaction with the application.
Testing: the application must be tested for compliance with the requirements and must work
without errors.

---
Backend config for IDEA

```DEV_DB_HOSTNAME=localhost;DEV_DB_NAME=fake_jira;DEV_DB_PASSWORD=password123;DEV_DB_USERNAME=user123;NODE_ENV=development;PORT=9000;PROD_DB_HOSTNAME=localhost;PROD_DB_NAME=fake_jira_prod;PROD_DB_PASSWORD=3579password;PROD_DB_USERNAME=realuser123;TEST_DB_HOSTNAME=localhost;TEST_DB_NAME=fake_jira_test;TEST_DB_PASSWORD=1356789test;TEST_DB_USERNAME=testuser123;WEBSOCKET_PORT=3155```

---
## Start application
execute command `docker compose up -d`
backend will work on 3001 port

---
## Notes
- Added umzug script for clear database on tests before run tests. Then execute migrations
- Added a lot of validation in business logic because don't have validator for requests.
When this task will be done, I want to add AJV validator and make more clear business logic
- Added 'individualHooks' to beforeBulkDestroy/Update for more comfortable work with this hook. Wrote comment about it in model
