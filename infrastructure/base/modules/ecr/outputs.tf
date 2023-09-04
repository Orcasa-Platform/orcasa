output "cms_ecr_repository_url" {
  value = aws_ecr_repository.cms_ecr.repository_url
}

output "client_ecr_repository_url" {
  value = aws_ecr_repository.client_ecr.repository_url
}
