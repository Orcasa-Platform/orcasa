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
    values = [var.demo_ec2_instance_type, var.staging_ec2_instance_type]
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

module "github_values" {
  source     = "./modules/github_values"
  repo_name  = var.repo_name
  secret_map = {
    TF_AWS_REGION                      = var.aws_region
    TF_PROJECT_NAME                    = var.project_name
    TF_CMS_REPOSITORY_NAME             = module.cms_ecr.repository_name
    TF_CLIENT_REPOSITORY_NAME          = module.client_ecr.repository_name
    TF_PIPELINE_USER_ACCESS_KEY_ID     = module.iam.pipeline_user_access_key_id
    TF_PIPELINE_USER_SECRET_ACCESS_KEY = module.iam.pipeline_user_access_key_secret
  }
  variable_map = {}
}


module "staging" {
  source             = "./modules/env"
  domain             = var.staging_domain
  project            = var.project_name
  environment        = "staging"
  aws_region         = var.aws_region
  repo_name          = var.repo_name
  vpc                = data.aws_vpc.default_vpc
  subnet_ids         = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform = var.beanstalk_platform
  beanstalk_tier     = var.beanstalk_tier

  ec2_instance_type = var.staging_ec2_instance_type

  rds_backup_retention_period = var.staging_rds_backup_retention_period
  rds_engine_version          = var.staging_rds_engine_version
  rds_instance_class          = var.staging_rds_instance_class
  rds_instance_count          = var.staging_rds_instance_count
  rds_log_retention_period    = var.staging_rds_log_retention_period

  data_bucket_name                              = local.bucket_name
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name

  wocat_token = var.wocat_token
}

module "demo" {
  source             = "./modules/env"
  domain             = var.demo_domain
  project            = var.project_name
  environment        = "demo"
  aws_region         = var.aws_region
  repo_name          = var.repo_name
  vpc                = data.aws_vpc.default_vpc
  subnet_ids         = local.subnets_with_ec2_instance_type_offering_ids
  availability_zones = data.aws_availability_zones.azs_with_ec2_instance_type_offering.names
  beanstalk_platform = var.beanstalk_platform
  beanstalk_tier     = var.beanstalk_tier

  ec2_instance_type = var.demo_ec2_instance_type

  rds_backup_retention_period = var.demo_rds_backup_retention_period
  rds_engine_version          = var.demo_rds_engine_version
  rds_instance_class          = var.demo_rds_instance_class
  rds_instance_count          = var.demo_rds_instance_count
  rds_log_retention_period    = var.demo_rds_log_retention_period

  data_bucket_name                              = local.bucket_name
  elasticbeanstalk_iam_service_linked_role_name = aws_iam_service_linked_role.elasticbeanstalk.name

  wocat_token = var.wocat_token
}
