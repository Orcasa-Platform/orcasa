# QGIS server

This folder contains a docker package QGIS server.

## Details

This docker file was created based
on [the official QGIS documentation](https://docs.qgis.org/3.28/en/docs/server_manual/containerized_deployment.html)
with little to no modifications. These docs go into deeper detail about how the image is built and how it can be
executed in different environments, so if the basic instructions in this file are not sufficient, please refer to the
link above.

## Usage details

The Docker image can be built and used as any regular docker image - refer to the official docker docs, the docs linked
above, or your favourite search engine for instructions on how to do that.

The QGIS server expects a `QGIS_PROJECT_FILE` env var that contains the full path to the QGIS server configuration file.
In the `/qgis/data` folder, a sample configuration file is provided (downloaded from the official QGIS docs link above).

At the root of this project, there is a `docker-compose.yml` file that contains a sample configuration for using this
QGIS docker image in a multi-container environment. This setup also demonstrates how to use a docker volume to pass
files to the QGIS server running inside the container. That too was based off the official QGIS docs linked above, so you
may want to refer to that link as well for more details on integrating/deploying this image in a multi-container setup.

In this folder there is also an `nginx.conf` file that contains a basic configuration for a nginx server that should be
used as a reverse proxy to make the QGIS available through HTTP - as
described [in the official docs](https://docs.qgis.org/3.28/en/docs/server_manual/containerized_deployment.html#first-run)
