# 1. Get the Public DNS of your EC2
locals {
  origin_id = "MoneyManager-EC2-Origin"
}

# 2. Create the CloudFront Distribution
resource "aws_cloudfront_distribution" "frontend_proxy" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Frontend Proxy for Money Manager"
  
  # CHANGED: Enables Edge Locations in India
  price_class         = "PriceClass_200" 

  origin {
    domain_name = aws_instance.k3s_server.public_dns
    origin_id   = local.origin_id

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.origin_id

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Host", "Origin", "Authorization"]
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

output "cloudfront_url" {
  value = aws_cloudfront_distribution.frontend_proxy.domain_name
}