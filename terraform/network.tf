# Use the Default VPC (Easiest for Phase 1)
data "aws_vpc" "default" {
  default = true
}

# Create a Security Group
resource "aws_security_group" "money_sg" {
  name        = "money-manager-sg"
  description = "Allow Web, SSH, and Internal DB traffic"
  vpc_id      = data.aws_vpc.default.id

  # Inbound: SSH (Be careful with 0.0.0.0/0 in production!)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # For stricter security, replace with your IP
  }

  # Inbound: HTTP (Web)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound: HTTPS (Web)
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound: K8s API (For kubectl from your laptop)
  ingress {
    description = "K3s API"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Ideally restrict to your IP
  }

  # Inbound: PostgreSQL (Db)
  ingress {
    description = "PostgreSQL"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Inbound: Self-Reference (Allow EC2 to talk to RDS)
  ingress {
    description = "Internal Communication"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  # Outbound: Allow everything (Downloads, Updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}