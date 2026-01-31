resource "aws_db_instance" "postgres" {
  identifier           = "money-manager-db"
  engine               = "postgres"
  engine_version       = "16"  # Check for latest available in Free Tier
  instance_class       = "db.t3.micro" # Free Tier Eligible
  allocated_storage    = 20            # Free Tier Limit
  storage_type         = "gp2"
  
  username             = "adminuser"
  password             = "SecurePass123!" # We will move this to secrets later!
  db_name              = "moneymanager"
  
  publicly_accessible  = true
  skip_final_snapshot  = true # Important for easy destruction during dev
  
  vpc_security_group_ids = [aws_security_group.money_sg.id]
}