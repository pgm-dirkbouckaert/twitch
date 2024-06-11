# Opdracht 2: A Twitch Application

Project by Dirk Bouckaert<br>
Programmeren 3<br>
Graduaat Programmeren Arteveldehogeschool 2022<br>

## Introduction
twITch is a platform on which teachers offer their videos on IT-related topics. 
- On registering you will be authenticated as a **reader**, so you can watch videos and playlists, and view teachers along with their associated videos and topics. You can add a star to videos.
- A **teacher** can also edit/delete own videos, assign a topic to a video and edit/delete own playlists.
- An **administrator** has full control over topics, videos, playlists and users.
- Each user has an account page where they can change their username, email, password and avatar.
- The app simulates an application procedure:
  - A reader can apply to become a teacher. 
  - A teacher can apply to become an admin.

## Installation
- Make sure you have Node, npm and Git installed.
- Download or clone the Git repository.
- If you plan to use the video seeder, you need to provide a YouTube API key.
- For demo purposes the `sqlite` file has been provided (in the `src/database` folder). 
  - If you wish, you can delete the sqlite-file before installation. A new one will be created, this way you start with a clean slate. 
  - Or you can change the database type and/or name in the `.env` file to use your own.
  - Seeders and factories have been provided. 
    - Run the seed command using the `--factory` and `--amount` flags, e.g. <br>
      `npm run seed --factory user --amount 1`
    - Suggested order for seeding: role | user | topic | video | playlist
- Run `npm install`
- Run `npm run start:dev`. The application will be served on [http://localhost:3000/](http://localhost:3000/)
- You can register and start using the app. 
  - You will be registered as a reader.
  - If you haven't changed the database source, you can use the following test accounts to explore the app:
    - username: reader@example.com | password: artevelde
    - username: teacher@example.com | password: artevelde
    - username: admin@example.com | password: artevelde

## Feature Overview

### Authentication
  - registration and login
  - validation (valid email, password length)
  - account page (change name, avatar, email, password)

### Authorization
  - A **reader** can view videos, playlists, teachers and topics.
  - A **teacher** can also 
    - add videos, edit own videos, assign a topic to own videos, 
    - add playlists, edit own playlists
  - An **administrator** has full control and can:
    - add, edit and delete topics
    - add, edit and delete videos
    - add, edit and delete playlists 
    - add, edit and delete users

### API
  - The app provides an API. 
  - For most routes (except `login` and `register`) you need an authorization token. 
    - Send a request to the `/api/login` endpoint to receive the token.
    - Put the token in the headers as `Authorization: Bearer {{token}}`.
  - The app provides Swagger API docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).
    - You need to login first to receive a token. 
    - Use the `Authorize` button on top of the page to authorize for `BearerAuth`.

## Technologies 
- MVC architecture using NodeJS and Express
- ES6 modules
- Template engine: Handlebars
- Database: TypeORM with sqlite3
- Authentication: 
  - JSON Web Token
  - bcrypt to encrypt and decrypt passwords 
- Form validation: express validator
- HTML, CSS and Javascript
- Testing: Jest
- Faker (for seeding)
- ESLint (eslint-config-airbnb)
- Swagger (API Docs)

## Author
Dirk Bouckaert<br>
With the kind help and guidance of his teachers: 
- Frederick Roegiers
- Tim De Paepe
