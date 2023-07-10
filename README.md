# Serverless App scaffold

This is a scaffold for a serverless app. It contains the next:

* A map with layers and legend
* Dataset and layer management
* CMS for data management: layers, datasets, legend and metadata
* An default layout of sidebar and map

## Client

Start the client with:

```bash
yarn client dev
```

## Server CMS

Start the server with:

```bash
yarn cms dev
```

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
