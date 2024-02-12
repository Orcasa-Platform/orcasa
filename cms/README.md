# ORCaSa Content Management System

## Overview

This platform is built using [Strapi](https://strapi.io/), with the necessary customizations to support the ORCaSa
project.

## Dependencies

- Node.js v20.11
- Postgres v15.4
- Yarn v4.1

## Install & run

### Native execution

- Install the necessary dependencies. Create a database for this application using your preferred database client
  application.
- Set the necessary configuration values - see the [Configuration](#configuration) section below.

Be sure to set the required environment variables before running the application - see
the [Configuration](#configuration) section below for more details.

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


### Using Docker

This project includes 2 docker configuration files:

- `Dockerfile` aimed at development environments (may require tuning to work on different environments)
- `Dockerfile.prod` aimed at production environments

You can use either file to build a docker image for this application. Be sure to set the required environment variables
when running the container - see the [Configuration](#configuration) section below.

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


## Data management

The CMS stores both user data and configuration data in the database. Different types of data are managed in different
ways:

### Managing configuration data

Configuration data handles tool-specific settings, such as admin labels, user roles, etc. Despite being natively stored
in the database by Strapi, this project uses
the [Strapi Config Sync](https://github.com/boazpoolman/strapi-plugin-config-sync) plugin to store this data in files,
that can be stored under version control, thus providing a clear source of truth and data migration path.

When modifying configuration data, be sure to use
the [plugin's admin interface](https://github.com/boazpoolman/strapi-plugin-config-sync#%EF%B8%8F-admin-panel-gui)
or [CLI tool](https://github.com/boazpoolman/strapi-plugin-config-sync#-command-line-interface-cli) to export
the data to files, and commit those to version control.

On deployment, the data on file will be automatically be imported, thus replacing previous settings changes.

### Managing user data

User data is data typically managed by users - in a blog site, user data would be posts or comments. In this project,
user data is stored in the database, thus becoming deployment specific. If you need to migrate user data between
deployments (for example, copy staging/production data to your local development environment), you can use
the installed [Strapi Import Export entries plugin](https://github.com/Baboo7/strapi-plugin-import-export-entries) to do
so. The plugin has dedicated sections in the admin UI for importing and exporting data. Refer to the plugin's
documentation for more details.
