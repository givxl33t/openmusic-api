# openmusic-api

Submission Project for Back-End Fundamental Class from Dicoding (Revised Submission Criteria, 20/12/2021)

# How to run
 
### *Recommended using Node.js 14.17.0 or above.

### Set up environment
[Documentation on PostgreSQL environment variables](https://www.postgresql.org/docs/current/libpq-envars.html)
```
Set PGUSER, PGHOST, PGPASSWORD, PGDATABASE, & PGPORT to your desire
on .env files.
```
### Install dependencies
```
$ npm install
```
### Create tables using migration
```
$ npm run migrate up
```
### Run web service in dev mode w/ nodemon
```
$ npm run start-dev
```
