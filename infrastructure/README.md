# Architecture

This solution is based on the following architecture:

![Architecture](./architecture.png)

The solution is composed of the following components:
- cms: a headless Strapi CMS that provides a REST API to manage the content of the website
- client: a Next.js application that consumes the CMS API and renders the website

Both are deployed on AWS using the following services:
- ECR: to store the Docker images
- Elastic Beanstalk: to deploy the Docker images using a multi-container Docker environment
- EC2: to host the Docker images (managed by Elastic Beanstalk)
- ALB: to route the traffic to the EC2 instances and provide SSL termination
- RDS: to host the database

Other AWS services are used internally by Elastic Beanstalk, for example:
- Autocaling: to scale the EC2 instances
- S3: to store the logs

# Deployment

The deployment is automated using a GH Action that builds the Docker images and deploys them to Elastic Beanstalk.

## Setting environment variables

Docker images are built in Github Actions. As such, environment variables for those images need to be
available to the Github Action runner - typically
through [Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
or [Variables](https://docs.github.com/en/actions/learn-github-actions/variables). There are two ways to set these
values on your Github repository so that they are available to the docker images built using this approach:

- Setting these through the included Terraform code.
- Setting these directly on the Github repository "Settings" page.

These approaches are functionally equivalent, but aim at supporting different use cases when setting these values. The
former approach privileges values that are tightly coupled with the overall infrastructure setup (e.g. database access
config), while the latter offers more flexibility and ease of use for values that require easier manipulation (directly
on the Github repository "Settings" page) and are less key to the infrastructure (e.g. frontend api key to access a 3rd
party service).

These Github Secrets/Variables follow a naming convention that identifies how they are meant to be managed:

- TF_(PRODUCTION|<UPPER CASE BRANCH NAME>)_[CLIENT_ENV|CMS_ENV]_<SECRET OR VARIABLE NAME> - managed by Terraform
- (PRODUCTION|<UPPER CASE BRANCH NAME>)_[CLIENT_ENV|CMS_ENV]_<SECRET OR VARIABLE NAME> - managed manually on the
  repository's "Settings" page

All Secrets/Variables that follow this naming convention will be automatically added to the respective docker image
build process, with their prefixes removed. If you need to add a new/custom secret/variable, and would like to do so
directly on the repository, be sure to name it accordingly. Likewise, manual changes done to TF_ prefixed values will be
overwritten by subsequent Terraform code, so do not modify those manually in the repository settings.

**Examples**

- STAGING_CLIENT_ENV_MY_API_KEY - goes into staging client `.env` as `MY_API_KEY`
- CLIENT_ENV_MY_OTHER_API_KEY - goes into client `.env` in all environments as `MY_OTHER_API_KEY`
- TF_CMS_ENV_DO_NOT_EDIT - goes into CMS `.env` in all environments as `DO_NOT_EDIT` but must not be edited in the
  Github "Settings" page - modify through Terraform if needed.

# Infrastructure as Code

The resources required to deploy the solution are defined in the `infrastructure` folder. The infrastructure is defined using Terraform.

There are two Terraform projects in the `infrastructure` folder:
- state: to store the Terraform remote state in an S3 bucket
- base: to deploy the infrastructure, using the remote state stored in the S3 bucket

The `state` project must be deployed first, and then the `base` project can be deployed.

# Elastic Beanstalk customisation

Customisation of the Elastic Beanstalk environment is done partly at the point of provisioning. For example, the instance types of the EC2 and RDS instances.

However, it is also possible to customise the environment after it has been provisioned. For example, the environment variables of the EC2 instances, nginx configurations.

The customisation options for Amazon Linux 2 platform can be found here:
https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.html

We're using the following customisation options, using the ".platform" folder:
- .platform/nginx/conf.d/orcasa.conf: to configure nginx to proxy the requests to the CMS and client applications
- .ebextensions/authorized_keys.config: to add public SSH keys to the EC2 instances

