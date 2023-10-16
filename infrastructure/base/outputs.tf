output "staging_postgresql_host" {
  value = module.staging.postgresql_host
}

output "staging_postgresql_port" {
  value = module.staging.postgresql_port
}

output "staging_dns_entries" {
  value = concat([
    {
      record_type  = "MX"
      record_name  = module.staging.mx_record_name
      record_value = module.staging.mx_record_value
    },
    {
      record_type  = "TXT"
      record_name  = module.staging.txt_record_name
      record_value = module.staging.txt_record_value
    },
    {
      record_type  = module.staging.acm_certificate_domain_validation_options[0].resource_record_type
      record_name  = module.staging.acm_certificate_domain_validation_options[0].resource_record_name
      record_value = module.staging.acm_certificate_domain_validation_options[0].resource_record_value
    },
    {
      record_type  = "CNAME"
      record_name  = var.staging_domain
      record_value = module.staging.beanstalk_environment_cname
    }
  ], [
    for token in module.staging.dkim_tokens : {
      record_type  = "CNAME"
      record_name  = "${token}._domainkey.${var.staging_domain}"
      record_value = "${token}.dkim.amazonses.com"
    }
  ])
}
