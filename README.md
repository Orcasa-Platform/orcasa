# ORCaSa

Launched in September 2022, ORCaSa is a Horizon Europe initiative that aims to bring together international stakeholders working on techniques for capturing and storing carbon in the soil.

The project seeks to address the issue of increasing carbon emissions from human activities, which have led to a disruption in the balance of organic carbon absorbed and stored in the soil to support plant growth.

## Development set up

Install all dependencies:

```bash
yarn install
```

### Client

Copy the .env.default file to .env.local and fill in the NEXT_PUBLIC_API_URL field with the url of the API. (By default it's http://localhost:1337/api)

Start the client with:

```bash
yarn client dev
```

### Strapi Server CMS

#### Requirements

- Node v20.5
- Postgres 15.4

#### Set up

1 - Ensure you have the dependencies up and running. Also ensure you have a database created for this application.

2 - Copy the `.env.example` file to `.env` and fill in the `DATABASE_NAME`, `DATABASE_USERNAME` and `DATABASE_PASSWORD` fields with your database credentials. Maybe you need to change the `DATABASE_HOST` and `DATABASE_PORT` fields too.

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
