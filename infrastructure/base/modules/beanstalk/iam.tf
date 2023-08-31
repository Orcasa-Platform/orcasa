# most of this is from https://gist.github.com/tomfa/6fc429af5d598a85e723b3f56f681237

# the role and profile for the EC2

resource "aws_iam_instance_profile" "beanstalk_ec2" {
  name = "${var.application_name}-beanstalk-ec2-user"
  role = aws_iam_role.beanstalk_ec2.name
}


resource "aws_iam_role" "beanstalk_ec2" {
  name               = "${var.application_name}-beanstalk-ec2-role"
  assume_role_policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_policy_attachment" "beanstalk_ec2_worker" {
  name       = "${var.application_name}-elastic-beanstalk-ec2-worker"
  roles      = [aws_iam_role.beanstalk_ec2.id]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_policy_attachment" "beanstalk_ec2_web" {
  name       = "${var.application_name}-elastic-beanstalk-ec2-web"
  roles      = [aws_iam_role.beanstalk_ec2.id]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_policy_attachment" "beanstalk_ec2_container" {
  name       = "${var.application_name}-elastic-beanstalk-ec2-container"
  roles      = [aws_iam_role.beanstalk_ec2.id]
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_policy_attachment" "beanstalk_ec2_ecr" {
  name       = "${var.application_name}-elastic-beanstalk-ec2-ecr"
  roles      = [aws_iam_role.beanstalk_ec2.id]
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_service_linked_role" "elasticbeanstalk" {
  aws_service_name = "elasticbeanstalk.amazonaws.com"
}
