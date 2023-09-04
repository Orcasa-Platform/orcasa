variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "ap-northeast-2"
}

variable "allowed_account_id" {
  type        = string
  description = "AWS account id"
}

variable "project_name" {
  type        = string
  description = "Short name of the project, will be used to prefix created resources"
}

variable "repo_name" {
  type        = string
  description = "Name of the Github repository where the code is hosted"
}

variable "staging_domain" {
  type = string
}

#
# Elastic Beanstalk configuration
# concepts: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/concepts.html
#
variable "beanstalk_platform" {
  type        = string
  description = "The Elastic Beanstalk platform to use. This needs to be a Docker platform (Linux, not ECS). If upgrade is available please ensure the EC2 AMI and deployment strategy is compatible. https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platforms-supported.html#platforms-supported.docker"
  default     = "64bit Amazon Linux 2 v3.6.0 running Docker"
}

variable "beanstalk_tier" {
  type        = string
  description = "The Elastic Beanstalk tier to use. This needs to be WebServer"
  default     = "WebServer"
}

#
# EC2 configuration
#
variable "ec2_instance_type" {
  type        = string
  description = "The type of EC2 instance to launch"
}

#
# RDS configuration
#
variable "rds_instance_class" {
  type        = string
  description = "Instance type of Aurora PostgreSQL server"
}

variable "rds_engine_version" {
  type        = string
  description = "RDS Database engine version"
}

variable "rds_instance_count" {
  type        = number
  default     = 1
  description = "Number of Aurora PostgreSQL instances before autoscaling"
}

variable "rds_log_retention_period" {
  type        = number
  default     = 1
  description = "Time in days to keep log files in cloud watch"
}

variable "rds_backup_retention_period" {
  type        = number
  default     = 7
  description = "Time in days to keep db backups"
}

variable "ga_tracking_id" {
  type        = string
  default     = ""
  description = "Google Analytics tracking id"
}
