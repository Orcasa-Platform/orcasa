#
# Site Server Security Groups
# SSH access to and from the world
# HTTP(S) access from the world
#
resource "aws_security_group" "site_server_ssh_security_group" {
  vpc_id      = var.vpc.id
  name        = "${var.project}-${var.environment}-public-ssh-sg"
  description = "Security group for SSH access to and from the world - ${var.project} ${var.environment}"

  tags = merge(
    {
      Name = "EC2 SSH access SG"
    },
    var.tags
  )

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "ssh_ingress" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.site_server_ssh_security_group.id
}

resource "aws_security_group_rule" "ssh_egress" {
  type        = "egress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = [var.vpc.cidr_block]

  security_group_id = aws_security_group.site_server_ssh_security_group.id
}

# Create elastic beanstalk application

resource "aws_elastic_beanstalk_application" "application" {
  name = var.application_name
}

# Settings for the elastic beanstalk environment

locals {
  environment_settings = [
    {
      namespace = "aws:ec2:vpc"
      name      = "VPCId"
      value     = var.vpc.id
    },
    {
      namespace = "aws:ec2:vpc"
      name      = "Subnets"
      value     = join(",", var.public_subnets)
    },
    {
      namespace = "aws:ec2:vpc"
      name      = "AssociatePublicIpAddress"
      value     = "True"
    },
    {
      namespace = "aws:ec2:vpc"
      name      = "ELBScheme"
      value     = "internet facing"
    },
    {
      namespace = "aws:elasticbeanstalk:environment:process:default"
      name      = "MatcherHTTPCode"
      value     = "200"
    },
    {
      namespace = "aws:elasticbeanstalk:environment"
      name      = "LoadBalancerType"
      value     = "application"
    },
    {
      namespace = "aws:elasticbeanstalk:environment"
      name      = "ServiceRole"
      value     = aws_iam_service_linked_role.elasticbeanstalk.name
    },
    {
      namespace = "aws:autoscaling:launchconfiguration"
      name      = "IamInstanceProfile"
      value     = aws_iam_instance_profile.beanstalk_ec2.name
    },
    {
      namespace = "aws:autoscaling:launchconfiguration"
      name      = "InstanceType"
      value     = var.ec2_instance_type
    },
    {
      namespace = "aws:autoscaling:launchconfiguration"
      name      = "RootVolumeSize"
      value     = "40"
    },
    {
      namespace = "aws:autoscaling:launchconfiguration"
      name      = "SecurityGroups"
      value     = join(",", [aws_security_group.site_server_ssh_security_group.id, var.rds_security_group_id])
    },
    {
      namespace = "aws:autoscaling:asg"
      name      = "MinSize"
      value     = 1
    },
    {
      namespace = "aws:autoscaling:asg"
      name      = "MaxSize"
      value     = 2
    },
    {
      namespace = "aws:elasticbeanstalk:healthreporting:system"
      name      = "SystemType"
      value     = "enhanced"
    },
    {
      namespace = "aws:elasticbeanstalk:cloudwatch:logs"
      name      = "StreamLogs"
      value     = "true"
    },
    {
      namespace = "aws:elasticbeanstalk:cloudwatch:logs"
      name      = "RetentionInDays"
      value     = "7"
    },
    {
      namespace = "aws:elasticbeanstalk:cloudwatch:logs"
      name      = "DeleteOnTerminate"
      value     = "false"
    },
    {
      namespace = "aws:elbv2:listener:443"
      name      = "ListenerEnabled"
      value     = var.acm_certificate.arn == "" ? "false" : "true"
    },
    {
      namespace = "aws:elbv2:listener:443"
      name      = "Protocol"
      value     = "HTTPS"
    },
    {
      namespace = "aws:elbv2:listener:443"
      name      = "SSLCertificateArns"
      value     = var.acm_certificate.arn
    }
  ]
}

# Create elastic beanstalk environment

resource "aws_elastic_beanstalk_environment" "application_environment" {
  name                   = var.application_environment
  application            = aws_elastic_beanstalk_application.application.name
  solution_stack_name    = var.solution_stack_name
  tier                   = var.tier
  wait_for_ready_timeout = "20m"

  dynamic "setting" {
    for_each = local.environment_settings
    content {
      namespace = setting.value["namespace"]
      name      = setting.value["name"]
      value     = setting.value["value"]
    }
  }
}

data "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_elastic_beanstalk_environment.application_environment.load_balancers[0]
  port              = 80
}

resource "aws_lb_listener_rule" "redirect_http_to_https" {
  listener_arn = data.aws_lb_listener.http_listener.arn
  priority     = 1

  action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
