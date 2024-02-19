aws_region         = "eu-west-3"
allowed_account_id = "282457417991"
project_name       = "orcasa"
repo_name          = "orcasa"

# domains managed externally
staging_domain = "staging.orcasa.dev-vizzuality.com"
staging_ec2_instance_type  = "c5a.xlarge"
staging_rds_engine_version = "15.5"
staging_rds_instance_class = "db.t3.micro"
staging_rds_backup_retention_period = 7

demo_domain    = "demo.orcasa.dev-vizzuality.com"
demo_ec2_instance_type  = "c5a.xlarge"
demo_rds_engine_version = "15.5"
demo_rds_instance_class = "db.t3.micro"
demo_rds_backup_retention_period = 30

beanstalk_platform = "64bit Amazon Linux 2023 v4.0.0 running Docker"
beanstalk_tier     = "WebServer"
