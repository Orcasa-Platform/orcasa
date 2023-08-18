# Serverless App scaffold

This is a scaffold for a serverless app. It contains the next:

- A map with layers and legend
- Dataset and layer management
- CMS for data management: layers, datasets, legend and metadata
- An default layout of sidebar and map

## Getting started

Install all dependencies:

```bash
yarn install
```

### Client

Copy the .env.example file to .env.local and fill in the NEXT_PUBLIC_API_URL field with the url of the API. (By default it's http://localhost:1337)

Add the NEXT_PUBLIC_MAPBOX_TOKEN field with the Mapbox token of the project. (You can get one [here](https://account.mapbox.com/access-tokens/))

Start the client with:

```bash
yarn client dev
```

### Strapi Server CMS

1 - Make sure you have Postgres installed and a Postgres database running locally.

You can download Postgres [here](https://www.postgresql.org/download/). Or the Posgres Mac app [here](https://postgresapp.com/).

If you don't already have a database, you can create it running:

```bash
createdb <database_name>
```

To create a user on the database run:

```bash
psql <database_name>
```

And then run:

```sql
CREATE USER <username> SUPERUSER PASSWORD <'passwordstring'>
```

2 - Copy the .env.example file to .env and fill in the DATABASE_NAME, DATABASE_USERNAME and DATABASE_PASSWORD fields with your database credentials. Maybe you need to change the DATABASE_HOST and DATABASE_PORT fields too.

3 - Then run the cms:

```bash
yarn cms dev
```

The admin page should open in your browser, if not go to http://localhost:1337/admin

4 - Create a new user so you can access the admin panel.

#### Seeding data

To seed the database with some data, run:

```bash
yarn cms seed
```

All the data and configuration should be imported.

## Types for API

To generate the types for the API, run:

```bash
yarn types build
```

## Usage with Docker (recommended)

To run the app with docker, run:

```bash
docker-compose up --build
```

Open the app in http://localhost:3000 for the client and http://localhost:1337 for the CMS.

NOTE: Docker is recommended for development, but not for production (yet).
