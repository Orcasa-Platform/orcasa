# ORCaSa

Launched in September 2022, ORCaSa is a Horizon Europe initiative that aims to bring together international stakeholders working on techniques for capturing and storing carbon in the soil.

The project seeks to address the issue of increasing carbon emissions from human activities, which have led to a disruption in the balance of organic carbon absorbed and stored in the soil to support plant growth.

## Solution architecture

This application is split into several parts, divided into their respective folders:
- `/cms`: A content management system (CMS) built with Strapi, which is used to manage the content Network4C and the map application.
- `/client`: A frontend application built using Next.js, which is used to display the content of the CMS and the map application.
- `/qgis`: A docker image that contains a QGIS server.
- `/infrastructure`: A Terraform configuration that deploys the client and CMS applications to AWS.

## Development usage 

### Native execution (recommended)

Please refer to the README.md on the `client` and `cms` folders respectively for instructions on how to run each application natively.

### Using Docker (experimental)

To run the app with docker, run:

```bash
docker-compose up --build
```

Open the app in http://localhost:3000 for the client and http://localhost:1337 for the CMS.

## Production usage

See the respective README.md on each application folder.
