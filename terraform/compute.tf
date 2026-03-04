# Find the latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu owner ID)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "aws_instance" "k3s_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro" # Recommended for K3s stability (~$0.04/hr)
  # For strict Free Tier use "t3.micro", but K3s might OOM (Out of Memory).

  key_name      = "money-key" # Make sure you created this Key Pair in AWS Console!

  vpc_security_group_ids = [aws_security_group.money_sg.id]

  # User Data: Script that runs on first boot
  user_data = <<-EOF
              #!/bin/bash
              # Update system
              apt-get update && apt-get upgrade -y
              
              # Install K3s (Lightweight Kubernetes)
              curl -sfL https://get.k3s.io | sh -
              
              # Allow 'ubuntu' user to use kubectl
              mkdir -p /home/ubuntu/.kube
              cp /etc/rancher/k3s/k3s.yaml /home/ubuntu/.kube/config
              chown ubuntu:ubuntu /home/ubuntu/.kube/config
              chmod 600 /home/ubuntu/.kube/config
              
              # Add kubectl alias
              echo 'alias k=kubectl' >> /home/ubuntu/.bashrc
              EOF

  tags = {
    Name = "MoneyManager-K3s-Node"
  }
}