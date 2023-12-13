data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_availability_zones" "all_available_azs" {
  state = "available"
}

# THIS IS TO FILTER THE AVAILABLE ZONES BY EC2 INSTANCE TYPE AVAILABILITY
# returns zone ids that have the requested instance type available
data "aws_ec2_instance_type_offerings" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "instance-type"
    values = [var.ec2_instance_type]
  }

  filter {
    name   = "location"
    values = data.aws_availability_zones.all_available_azs.zone_ids
  }

  location_type = "availability-zone-id"
}

# THIS IS TO FIND THE NAMES OF THOSE ZONES GIVEN BY IDS FROM ABOVE...
# because we need the names to pass to the staging module
data "aws_availability_zones" "azs_with_ec2_instance_type_offering" {
  filter {
    name   = "zone-id"
    values = sort(data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations)
  }
}

# THIS IS TO FILTER THE SUBNETS BY AVAILABILITY ZONES WITH EC2 INSTANCE TYPE AVAILABILITY
# so that we know which subnets can be passed to the beanstalk resource without upsetting it
data "aws_subnets" "subnets_with_ec2_instance_type_offering_map" {
  for_each = toset(
    data.aws_ec2_instance_type_offerings.azs_with_ec2_instance_type_offering.locations
  )

  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }

  filter {
    name   = "availability-zone-id"
    values = ["${each.value}"]
  }
}

locals {
  subnets_with_ec2_instance_type_offering_ids = sort([
    for k, v in data.aws_subnets.subnets_with_ec2_instance_type_offering_map : v.ids[0]
  ])

  bucket_name = "orcasa-data-layer-upload-public"
}

module "iam" {
  source = "./modules/iam"
}

#
# Staging secrets
#

resource "random_password" "staging_api_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "staging_admin_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "staging_transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "staging_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "staging_nextauth_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "staging_app_key" {
  length           = 32
  special          = false
  numeric          = false
  override_special = "!#%&*()-_=+[]{}<>:?"
}

#
# Demo secrets
#

resource "random_password" "demo_api_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "demo_admin_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "demo_transfer_token_salt" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "demo_jwt_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "demo_nextauth_secret" {
  length           = 32
  special          = true
  override_special = "!#%&*()-_=+[]{}<>:?"
}

resource "random_password" "demo_app_key" {
  length           = 32
  special          = false
  numeric          = false
  override_special = "!#%&*()-_=+[]{}<>:?"
}

locals {
  staging_cms_env = {
    HOST                = "0.0.0.0"
    PORT                = 1337
    APP_KEYS            = random_password.staging_app_key.result
    API_TOKEN_SALT      = random_password.staging_api_token_salt.result
    ADMIN_JWT_SECRET    = random_password.staging_admin_jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.staging_transfer_token_salt.result
    JWT_SECRET          = random_password.staging_jwt_secret.result
    CMS_URL             = "https://${var.staging_domain}/cms/"

    # Database
    DATABASE_CLIENT                  = "postgres"
    DATABASE_HOST                    = module.staging.postgresql_host
    DATABASE_PORT                    = module.staging.postgresql_port
    DATABASE_NAME                    = module.staging.postgresql_db_name
    DATABASE_USERNAME                = module.staging.postgresql_username
    DATABASE_PASSWORD                = module.staging.postgresql_password
    DATABASE_SSL                     = true
    DATABASE_SSL_REJECT_UNAUTHORIZED = false

    SMTP_FROM     = "no-reply@no-reply.${var.staging_domain}"
    SMTP_REPLY_TO = "no-reply@no-reply.${var.staging_domain}"
    SMTP_HOST     = "email-smtp.${var.aws_region}.amazonaws.com"
    SMTP_PORT     = 465
    SMTP_USER     = module.staging.smtp_username
    SMTP_PASSWORD = module.staging.smtp_password
  }
  staging_client_env = {
    NEXT_PUBLIC_URL                                 = "https://${var.staging_domain}"
    NEXT_PUBLIC_ENVIRONMENT                         = "production"
    NEXT_PUBLIC_API_URL                             = "https://${var.staging_domain}/cms/api"
    NEXT_PUBLIC_DATASETS_API_URL                    = "https://orcasa.apis.ekoal.org"
    NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS = "emilie.vrot@cirad.fr,mathieu.nogues@inrae.fr,carla.biscotti@vizzuality.com"
    NEXT_PUBLIC_GA_TRACKING_ID                      = var.ga_tracking_id
    LOG_LEVEL                                       = "info"
  }
  demo_cms_env = {
    HOST                = "0.0.0.0"
    PORT                = 1337
    APP_KEYS            = random_password.demo_app_key.result
    API_TOKEN_SALT      = random_password.demo_api_token_salt.result
    ADMIN_JWT_SECRET    = random_password.demo_admin_jwt_secret.result
    TRANSFER_TOKEN_SALT = random_password.demo_transfer_token_salt.result
    JWT_SECRET          = random_password.demo_jwt_secret.result
    CMS_URL             = "https://${var.demo_domain}/cms/"

    # Database
    DATABASE_CLIENT                  = "postgres"
    DATABASE_HOST                    = module.demo.postgresql_host
    DATABASE_PORT                    = module.demo.postgresql_port
    DATABASE_NAME                    = module.demo.postgresql_db_name
    DATABASE_USERNAME                = module.demo.postgresql_username
    DATABASE_PASSWORD                = module.demo.postgresql_password
    DATABASE_SSL                     = true
    DATABASE_SSL_REJECT_UNAUTHORIZED = false

    SMTP_FROM     = "no-reply@no-reply.${var.demo_domain}"
    SMTP_REPLY_TO = "no-reply@no-reply.${var.demo_domain}"
    SMTP_HOST     = "email-smtp.${var.aws_region}.amazonaws.com"
    SMTP_PORT     = 465
    SMTP_USER     = module.demo.smtp_username
    SMTP_PASSWORD = module.demo.smtp_password
  }
  demo_client_env = {
    NEXT_PUBLIC_URL                                 = "https://${var.demo_domain}"
    NEXT_PUBLIC_ENVIRONMENT                         = "production"
    NEXT_PUBLIC_API_URL                             = "https://${var.demo_domain}/cms/api"
    NEXT_PUBLIC_DATASETS_API_URL                    = "https://orcasa.apis.ekoal.org"
    NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS = "emilie.vrot@cirad.fr,mathieu.nogues@inrae.fr"
    NEXT_PUBLIC_GA_TRACKING_ID                      = var.ga_tracking_id
    LOG_LEVEL                                       = "info"
  }
}

module "github_values" {
  source     = "./modules/github_values"
  repo_name  = var.repo_name
  secret_map = {
    PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
    CMS_REPOSITORY_NAME             = module.cms_ecr.repository_name
    CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    QGIS_REPOSITORY_NAME            = module.qgis_ecr.repository_name
    STAGING_CMS_ENV_FILE            = join("\n", [for key, value in local.staging_cms_env : "${key}=${value}"])
    STAGING_CLIENT_ENV_FILE         = join("\n", [for key, value in local.staging_client_env : "${key}=${value}"])
    STAGING_DOMAIN                  = var.staging_domain
    DEMO_CMS_ENV_FILE               = join("\n", [for key, value in local.demo_cms_env : "${key}=${value}"])
    DEMO_CLIENT_ENV_FILE            = join("\n", [for key, value in local.demo_client_env : "${key}=${value}"])
    DEMO_DOMAIN                     = var.demo_domain
  }
  variable_map = {
    AWS_REGION = var.aws_region
  }
}

module "data_bucket" {
  source      = "./modules/bucket"
  bucket_name = local.bucket_name
}

module "cms_ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repo_name    = "cms"
}

module "client_ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repo_name    = "client"
}

module "qgis_ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  repo_name    = "qgis"
}

resource "aws_iam_service_linked_role" "elasticbeanstalk" {
  aws_service_name = "elasticbeanstalk.amazonaws.com"
}

module "staging" {
  source                                        = "./modules/env"
  domain                                        = var.staging_domain
  project                                       = var.project_name
  environment                                   = "staging"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = var.beanstalk_platform
  beanstalk_tier                                = var.beanstalk_tier
  ec2_instance_type                             = var.ec2_instance_type
  rds_engine_version                            = var.rds_engine_version
  rds_instance_class                            = var.rds_instance_class
  data_bucket_name                              = local.bucket_name
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
}

module "demo" {
  source                                        = "./modules/env"
  domain                                        = var.demo_domain
  project                                       = var.project_name
  environment                                   = "demo"
  aws_region                                    = var.aws_region
  vpc                                           = data.aws_vpc.default_vpc
  subnet_ids                                    = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones                            = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform                            = var.beanstalk_platform
  beanstalk_tier                                = var.beanstalk_tier
  ec2_instance_type                             = var.ec2_instance_type
  rds_engine_version                            = var.rds_engine_version
  rds_instance_class                            = var.rds_instance_class
  data_bucket_name                              = local.bucket_name
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name
}
