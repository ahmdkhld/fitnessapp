terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }

  # Uncomment and configure before first apply:
  # terraform {
  #   backend "s3" {
  #     bucket         = "nutritrack-terraform-state"
  #     key            = "prod/terraform.tfstate"
  #     region         = "us-east-1"
  #     dynamodb_table = "nutritrack-terraform-locks"
  #     encrypt        = true
  #   }
  # }
}

provider "aws" {
  region = var.region
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "nutritrack"
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "container_image" {
  type        = string
  description = "ECR image URI for the API container"
}

variable "cors_allowed_origins" {
  type        = list(string)
  description = "Allowed origins for S3 CORS configuration"
  default     = ["https://app.nutritrack.com"]
}

variable "domain_name" {
  type        = string
  description = "Primary domain name for the application (used for ACM certificate)"
  default     = "api.nutritrack.com"
}

variable "sns_alert_email" {
  type        = string
  description = "Email address for CloudWatch alarm notifications"
  default     = ""
}

locals {
  tags = {
    Project   = var.project
    ManagedBy = "terraform"
  }
}
