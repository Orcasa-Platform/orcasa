# ORCaSa client application

## Overview

This platform is built using Nodejs and [Next.js](https://nextjs.org/), with the necessary elements to support the ORCaSa
project.

The repository contains all of ORCaSa's modules but Scientific Evidence which can be found in [Orcasa-Platform/orcasa-review4c](https://github.com/Orcasa-Platform/orcasa-review4c).

### Docker

This project includes 2 docker configuration files:

- `Dockerfile` aimed at development environments (may require tuning to work on different environments)
- `Dockerfile.prod` aimed at production environments

You can use either file to build a docker image for this application. Be sure to set the required environment variables
when running the container.


### Configuration

| Variable name              | Description                                                                                                                                                                                                 |           Default value |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------:|
| NEXT_PUBLIC_ENVIRONMENT    | `'develop', 'staging', 'production'`. There are many times where you want to do things on specific environments. Load a third party library only in production, enable search engines only in production... |                 develop |
| NEXT_PUBLIC_URL            | Canonical URL                                                                                                                                                                                               |  http://localhost:$PORT |
| NEXT_PUBLIC_API_URL        | URL of the [CMS](https://github.com/Orcasa-Platform/orcasa/tree/main/cms) API.                                                                                                                              | http://0.0.0.0:1337/cms |
| NEXT_PUBLIC_GA_TRACKING_ID | Google Analytics tracking ID. If you're working with an Google Analytics 4 property, you have a Measurement ID instead of a Tracking ID.                                                                    |                         |
| LOG_LEVEL                  | Logger level                                                                                                                                                                                                |                   debug |
