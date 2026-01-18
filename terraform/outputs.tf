output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.k3s_server.public_ip
}

output "db_endpoint" {
  description = "The connection endpoint for the RDS instance"
  value       = aws_db_instance.postgres.endpoint
}

output "db_connection_url" {
  description = "PostgreSQL connection URL"
  value       = "postgres://${aws_db_instance.postgres.username}:${aws_db_instance.postgres.password}@${aws_db_instance.postgres.endpoint}/${aws_db_instance.postgres.db_name}"
  sensitive   = true
}
