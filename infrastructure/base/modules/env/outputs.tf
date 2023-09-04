output "postgresql_host" {
  value = module.postgresql.host
}

output "postgresql_port" {
  value = module.postgresql.port
}

output "postgresql_username" {
  value = module.postgresql.username
}

output "postgresql_password" {
  value = module.postgresql.password
}

output "beanstalk_environment_settings" {
  value = module.beanstalk.environment_settings
}

output "beanstalk_environment_cname" {
  value = module.beanstalk.environment_cname
}

output "acm_certificate_domain_validation_options" {
  description = "A list of attributes to feed into other resources to complete certificate validation. Can have more than one element, e.g. if SANs are defined. Only set if DNS-validation was used."
  value       = flatten(aws_acm_certificate.acm_certificate[*].domain_validation_options)
}

output "acm_certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.acm_certificate.arn
}
