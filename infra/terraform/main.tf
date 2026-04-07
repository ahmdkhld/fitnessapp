terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
  # Configure remote state in your own S3 bucket before running plan/apply.
  # backend "s3" {
  #   bucket = "nutritrack-tfstate"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
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

locals {
  tags = {
    Project   = var.project
    ManagedBy = "terraform"
  }
}
