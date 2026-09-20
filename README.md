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
## Access Instructions
- Access your colors application at http://<your Apache server's IP address>.
- The web app is hosted at this domain: http://collateralconscience.store.