# ORCaSa Content Management System

## Overview

This platform is built using [Strapi](https://strapi.io/), with the necessary customizations to support the ORCaSa
project.

## Dependencies

- Nodejs v18.17
- Postgres v15.4
- Yarn v3.6

## Set up

- Install the necessary dependencies. Create a database for this application using your prefered database client
  application.
- Set the necessary configuration values - see the [Configuration](#configuration) section below.

To run the application in development mode, use:

```bash
yarn dev
```

To run the application in production mode, use:

```bash
yarn build
yarn start
```

In both situations, be sure to set the corresponding `NODE_ENV` value.

## Configuration

Configuration is done using environment variables that manipulate and extend the default Strapi configuration - refer to
the official Strapi docs for more details on these or other configuration options.

You can set custom values for environment variables in a number of different ways, including by copying the
included `.env.example` to `.env` and setting the values there.

The following environment variables are used:

| Variable name       |                                                                                                                                                                                                     Description |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| HOST                |                                                                                                                                                        Hostname where the CMS is reachable. Typically `0.0.0.0` |              
| PORT                |                                                                                                                                                  Port on which the nodejs webserver will listen for connections |              
| APP_KEYS            | Declare session keys (based on [Koa session](https://github.com/koajs/session/blob/master/Readme.md)), which is used by the session middleware for the Users & Permissions plugin and the Documentation plugin. |              
| API_TOKEN_SALT      |                                                                                                                   Salt used to generate [API tokens](https://docs.strapi.io/dev-docs/configurations/api-tokens) |              
| TRANSFER_TOKEN_SALT |          Salt used to generate [Transfer tokens](https://docs.strapi.io/dev-docs/data-management/transfer#generate-a-transfer-token). If no transfer token salt is defined, transfer features will be disabled. |              
| ADMIN_JWT_SECRET    |                                                                                                                                                                          Secret used to encode admin JWT tokens |              
| JWT_SECRET          |                                                                                                                                                                           Secret used to encode user JWT tokens |              
| DATABASE_CLIENT     |                                                                                                                                                                                 Database client. Use `postgres` |              
| DATABASE_HOST       |                                                                                                                                                                                            Database server host |              
| DATABASE_PORT       |                                                                                                                                                                                            Database server port |              
| DATABASE_NAME       |                                                                                                                                                                                                   Database name |              
| DATABASE_USERNAME   |                                                                                                                                                                                               Database username |              
| DATABASE_PASSWORD   |                                                                                                                                                                                               Database password |              
| DATABASE_SSL        |                                                                                                                                                    If SSL should be used when connecting to the database server |              


## Docker

This project includes 2 docker configuration files:
- `Dockerfile` aimed at development environments (may require tuning to work on different environments)
- `Dockerfile.prod` aimed at production environments

You can use either file to build a docker image for this application. Be sure to set the required environment variables
when running the container.
