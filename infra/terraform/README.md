# NutriTrack Infrastructure (Terraform)

Minimal AWS skeleton for production: VPC with public + private subnets,
RDS Postgres 16, S3 uploads bucket, ECS Fargate running the API behind an ALB.

**Review carefully before running** — this is a starting point, not a
production-ready blueprint. Missing items include:

- TLS certificate + HTTPS listener (add `aws_acm_certificate` and port 443)
- Route 53 record for `api.nutritrack.app`
- RDS Multi-AZ + encrypted storage
- Secrets Manager for `JWT_SECRET` / `JWT_REFRESH_SECRET` / SMTP creds
- CloudWatch alarms + auto-scaling policy on the ECS service
- VPC flow logs

## Usage

```bash
cd infra/terraform
terraform init
terraform plan \
  -var="db_password=$(openssl rand -hex 32)" \
  -var="container_image=<ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/nutritrack:latest"
terraform apply ...
```

Push the image to ECR first:

```bash
aws ecr create-repository --repository-name nutritrack
docker build -t nutritrack ./backend
docker tag nutritrack:latest <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/nutritrack:latest
docker push <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/nutritrack:latest
```

After apply, run database migrations (one-off task):

```bash
aws ecs run-task \
  --cluster nutritrack-cluster \
  --task-definition nutritrack-api \
  --launch-type FARGATE \
  --network-configuration '...' \
  --overrides '{"containerOverrides":[{"name":"api","command":["npx","prisma","migrate","deploy"]}]}'
```
