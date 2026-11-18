# colors-lamp
## Description
Colors is a simple web app built using a LAMP stack. Users can log in through the web portal, add colors to their profile, and search for colors that have been added.
## Technologies Used
- LAMP stack: Linux, Apache, MySQL, and PHP.
- Server hosting: DigitalOcean
- IDE: Visual Studio Code
- Version Control: Git/GitHub
## Setup Instructions
1. Copy everything inside of this repository to /var/www/html on an Apache web server.
2. Install composer at https://getcomposer.org in /var/www/html/api.
3. Create the MySQL database on the web server using database.sql.
4. Create a database user for the API so it can interact with the database.
5. Create a .env file in /var/www/html/api with the database user credentials (DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME).
6. Insert at least one user account into the database.
7. Change the urlBase variable in code.js (line 1) to use your server.
## Access Instructions
- Access your colors application at http://<your Apache server's IP address>.
- The web app is hosted at this domain: http://collateralconscience.store.
## Backend testing
Backend tests use a live PHP server and a dedicated MySQL test database. Configure
the API database credentials in `api/.env`, create a test user with an MD5 password,
and place that user's credentials in `tests/backend/.env.test`:
```dotenv
TEST_USERNAME=jest-user
TEST_PASSWORD=jest-password
```
The backend test runner loads this file automatically:
```bash
npm run test:backend
```
Keep both files local; they are ignored by Git. Do not use production database
credentials. The add-color test writes a uniquely named test value to the database.
## Continuous integration
GitHub Actions runs the linters and both Jest suites on every push and pull request.
The workflow creates its own MySQL 8.0 database and test environment, so no `.env`
files or database secrets need to be committed.