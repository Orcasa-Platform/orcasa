# ORCaSa client application

## Overview

This platform is built using Node.js and [Next.js](https://nextjs.org/), with the necessary elements to support the
ORCaSa
project.

The repository contains all of ORCaSa's modules but Scientific Evidence which can be found
in [Orcasa-Platform/orcasa-review4c](https://github.com/Orcasa-Platform/orcasa-review4c).

## Dependencies

- Node.js v20.11
- Yarn v4.1

## Install & run

### Native execution

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

### Docker

This project includes 2 docker configuration files:

- `Dockerfile` aimed at development environments (may require tuning to work on different environments)
- `Dockerfile.prod` aimed at production environments

You can use either file to build a docker image for this application. Be sure to set the required environment variables
when running the container.

### Configuration

| Variable name                                 | Description                                                                                                                                                                                                 |           Default value |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------:|
| NEXT_PUBLIC_ENVIRONMENT                       | `'develop', 'staging', 'production'`. There are many times where you want to do things on specific environments. Load a third party library only in production, enable search engines only in production... |                 develop |
| NEXT_PUBLIC_URL                               | Canonical URL                                                                                                                                                                                               |  http://localhost:$PORT |
| NEXT_PUBLIC_API_URL                           | URL of the [CMS](https://github.com/Orcasa-Platform/orcasa/tree/main/cms) API.                                                                                                                              | http://0.0.0.0:1337/cms |
| NEXT_PUBLIC_DATASETS_API_URL                  | URL of the Datasets API                                                                                                                                                                                     |                         |
| NEXT_PUBLIC_GA_TRACKING_ID                    | Google Analytics tracking ID. If you're working with an Google Analytics 4 property, you have a Measurement ID instead of a Tracking ID.                                                                    |                         |
| LOG_LEVEL                                     | Logger level                                                                                                                                                                                                |                   debug |
| NEXT_PUBLIC_MATOMO_SITE_ID                    | Site Id for Matomo analytics. This only should be available on production and different values on staging and demo for testing default                                                                      |                      '' |
| NEXT_PUBLIC_MATOMO_URL                        | Site URL for Matomo analytics. This only should be available on production and different values on staging and demo for testing default                                                                     |                      '' |
| NEXT_USE_RESTRICTIVE_ROBOTS_TXT               | If set to true, the robots.txt will ask search engines to not index the site                                                                                                                                |                      '' |
| NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL | URL of the Scientific Evidence API                                                                                                                                                                          |                      '' |
| NEXT_PUBLIC_MAPBOX_TOKEN                      | Mapbox' token used for maps                                                                                                                                                                                 |                      '' |
| NEXT_PUBLIC_SURVEY_URL                        | URL of the survey displayed on the modules. If missing, the survey won't be displayed.                                                                                                                      |                      '' |
| NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL      | Date until which the survey's dialog is expanded by default. The format must be YYYY-MM-DD. If missing, the dialog will be collapsed.                                                                       |                      '' |
