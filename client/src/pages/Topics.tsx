import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Code2, Cloud, Cpu, GitBranch, Boxes, Gauge, ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Module {
  title: string;
  notes: string;
  examples: { code: string; description?: string }[];
}

interface Topic {
  id: string;
  title: string;
  icon: any;
  description: string;
  modules: Module[];
}

const topics: Topic[] = [
  {
    id: "linux",
    title: "Linux & Scripting",
    icon: Code2,
    description: "Master Linux fundamentals and shell scripting for DevOps automation",
    modules: [
      {
        title: "Linux Basics & File System",
        notes: `Linux is the backbone of modern DevOps. Almost all servers, containers, and cloud instances run Linux. Understanding the file system hierarchy is critical:

• / — Root directory, the top of the file system tree
• /home — User home directories
• /etc — System configuration files (e.g., /etc/hosts, /etc/nginx/)
• /var — Variable data like logs (/var/log) and mail
• /tmp — Temporary files, cleared on reboot
• /usr — User programs and utilities
• /opt — Optional/third-party software

Key concepts: Everything in Linux is a file. Permissions follow the rwx (read/write/execute) model for owner, group, and others. The permission number 755 means owner can read/write/execute, group and others can read/execute.`,
        examples: [
          { code: "ls -la /home", description: "List all files including hidden ones with details" },
          { code: "chmod 755 script.sh", description: "Set executable permissions on a script" },
          { code: "chown user:group file.txt", description: "Change file ownership" },
          { code: "find . -name '*.log' -type f -mtime +7", description: "Find log files older than 7 days" },
          { code: "df -h", description: "Show disk space usage in human-readable format" },
          { code: "top -bn1 | head -20", description: "Show top processes (non-interactive)" },
        ],
      },
      {
        title: "Shell Scripting Fundamentals",
        notes: `Shell scripts automate repetitive tasks. Every DevOps engineer must be comfortable writing bash scripts.

Key concepts:
• Shebang (#!/bin/bash) — Tells the system which interpreter to use
• Variables — No spaces around = sign: NAME="value"
• Conditionals — if [ condition ]; then ... fi
• Loops — for, while, until
• Functions — Reusable blocks of code
• Exit codes — 0 means success, non-zero means failure
• Piping (|) — Send output of one command as input to another
• Redirection — > (overwrite), >> (append), 2>&1 (redirect stderr to stdout)`,
        examples: [
          { code: `#!/bin/bash
# Deploy script with error handling
set -e  # Exit on any error

APP_NAME="myapp"
DEPLOY_DIR="/opt/$APP_NAME"

echo "Deploying $APP_NAME..."

if [ ! -d "$DEPLOY_DIR" ]; then
  mkdir -p "$DEPLOY_DIR"
  echo "Created deploy directory"
fi

cp -r ./dist/* "$DEPLOY_DIR/"
echo "Files copied successfully"

systemctl restart $APP_NAME
echo "Service restarted"`, description: "Complete deployment script with error handling" },
          { code: `#!/bin/bash
# Loop through servers and check status
SERVERS=("web01" "web02" "db01")

for server in "\${SERVERS[@]}"; do
  if ping -c 1 "$server" &>/dev/null; then
    echo "✓ $server is UP"
  else
    echo "✗ $server is DOWN"
  fi
done`, description: "Health check script for multiple servers" },
          { code: `#!/bin/bash
# Log rotation function
rotate_logs() {
  local log_dir=$1
  local max_age=$2
  find "$log_dir" -name "*.log" -mtime +$max_age -delete
  echo "Cleaned logs older than $max_age days"
}

rotate_logs /var/log/myapp 30`, description: "Function for log rotation" },
        ],
      },
      {
        title: "Package Management & System Administration",
        notes: `Package managers install, update, and remove software. Different Linux distributions use different package managers:

• Debian/Ubuntu: apt (apt-get, apt-cache)
• RHEL/CentOS: yum or dnf
• macOS: brew (Homebrew)

System administration tasks include managing services (systemctl), monitoring resources, configuring networking, and managing users. The systemctl command controls systemd services — start, stop, restart, enable (auto-start on boot), and check status.`,
        examples: [
          { code: `# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y nginx docker.io
sudo apt-get upgrade -y`, description: "Update and install packages on Ubuntu" },
          { code: `# RHEL/CentOS
sudo yum install -y docker-ce
sudo systemctl start docker
sudo systemctl enable docker`, description: "Install and enable Docker on CentOS" },
          { code: `# Service management
sudo systemctl status nginx
sudo systemctl restart nginx
sudo journalctl -u nginx -f`, description: "Manage and monitor services with systemctl" },
        ],
      },
    ],
  },
  {
    id: "git",
    title: "Git & GitHub",
    icon: GitBranch,
    description: "Version control and collaborative development workflows",
    modules: [
      {
        title: "Git Fundamentals",
        notes: `Git is a distributed version control system. Every developer has a full copy of the repository history.

Core concepts:
• Working Directory — Where you edit files
• Staging Area (Index) — Where you prepare commits (git add)
• Local Repository — Your committed history (git commit)
• Remote Repository — Shared repo on GitHub/GitLab (git push/pull)

The three-tree architecture: HEAD (last commit) → Index (staging) → Working Directory. Understanding this flow is key to mastering Git.`,
        examples: [
          { code: `# Initialize and first commit
git init
git add .
git commit -m "Initial commit"`, description: "Start a new repository" },
          { code: `# Check status and history
git status
git log --oneline --graph --all
git diff HEAD~1`, description: "Inspect repository state" },
          { code: `# Branching
git branch feature/login
git checkout feature/login
# Or in one command:
git checkout -b feature/login`, description: "Create and switch branches" },
          { code: `# Stashing work in progress
git stash
git stash list
git stash pop`, description: "Temporarily save uncommitted changes" },
        ],
      },
      {
        title: "Remote Repositories & Collaboration",
        notes: `Remote repositories enable team collaboration. GitHub, GitLab, and Bitbucket are popular hosting platforms.

Workflow:
1. Fork or clone the repository
2. Create a feature branch
3. Make changes and commit
4. Push to remote
5. Create a Pull Request (PR)
6. Code review and approval
7. Merge to main branch

Best practices: Write meaningful commit messages, keep PRs small and focused, always pull before pushing, use .gitignore to exclude build artifacts.`,
        examples: [
          { code: `# Connect to remote
git remote add origin https://github.com/user/repo.git
git push -u origin main`, description: "Link local repo to GitHub" },
          { code: `# Feature branch workflow
git checkout -b feature/new-feature
# ... make changes ...
git add .
git commit -m "feat: add user authentication"
git push origin feature/new-feature
# Then create PR on GitHub`, description: "Standard feature branch workflow" },
          { code: `# Sync with remote
git fetch origin
git pull origin main
git rebase main  # Rebase feature branch onto main`, description: "Keep your branch up to date" },
          { code: `# Resolve merge conflicts
git merge main
# Edit conflicted files, then:
git add .
git commit -m "resolve merge conflicts"`, description: "Handle merge conflicts" },
        ],
      },
    ],
  },
  {
    id: "docker",
    title: "Docker",
    icon: Boxes,
    description: "Containerization, image management, and multi-container orchestration",
    modules: [
      {
        title: "Docker Fundamentals",
        notes: `Docker packages applications into containers — lightweight, portable, self-sufficient units that include everything needed to run: code, runtime, libraries, and settings.

Key concepts:
• Image — A read-only template (like a class in OOP)
• Container — A running instance of an image (like an object)
• Dockerfile — Instructions to build an image
• Registry — Storage for images (Docker Hub, ECR, GCR)
• Volume — Persistent storage that survives container restarts
• Network — Communication between containers

Containers vs VMs: Containers share the host OS kernel, making them much lighter (MBs vs GBs) and faster to start (seconds vs minutes).`,
        examples: [
          { code: `# Build and run
docker build -t myapp:latest .
docker run -d -p 3000:3000 --name myapp myapp:latest
docker ps
docker logs myapp -f`, description: "Build image and run container" },
          { code: `# Dockerfile example
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]`, description: "Multi-stage Dockerfile for Node.js" },
          { code: `# Container management
docker exec -it myapp sh        # Shell into container
docker stop myapp                # Stop container
docker rm myapp                  # Remove container
docker rmi myapp:latest          # Remove image
docker system prune -a           # Clean up everything`, description: "Common container operations" },
        ],
      },
      {
        title: "Docker Compose",
        notes: `Docker Compose defines and runs multi-container applications. A single YAML file describes all services, networks, and volumes.

Key features:
• Service definitions with build context or image references
• Network isolation between services
• Volume mounting for persistent data
• Environment variable configuration
• Dependency ordering with depends_on
• Health checks for service readiness

Services communicate using their service name as hostname (e.g., the app connects to the database using "db" as the host).`,
        examples: [
          { code: `# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpass
      - MYSQL_DATABASE=mydb
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 10s
      retries: 5

volumes:
  db_data:`, description: "Complete docker-compose.yml with health checks" },
          { code: `# Docker Compose commands
docker-compose up -d          # Start in background
docker-compose ps             # List services
docker-compose logs -f app    # Follow app logs
docker-compose down -v        # Stop and remove volumes`, description: "Essential Compose commands" },
        ],
      },
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes",
    icon: Cpu,
    description: "Container orchestration, deployments, services, and state management",
    modules: [
      {
        title: "Kubernetes Architecture & Basics",
        notes: `Kubernetes (K8s) automates deployment, scaling, and management of containerized applications.

Architecture:
• Control Plane: API Server, etcd, Scheduler, Controller Manager
• Worker Nodes: kubelet, kube-proxy, Container Runtime

Core objects:
• Pod — Smallest deployable unit, one or more containers
• Deployment — Manages ReplicaSets, handles rolling updates
• Service — Stable network endpoint for pods (ClusterIP, NodePort, LoadBalancer)
• ConfigMap/Secret — Configuration and sensitive data
• PersistentVolumeClaim — Storage requests
• Namespace — Virtual cluster isolation

kubectl is the CLI tool for interacting with the cluster.`,
        examples: [
          { code: `# Deployment manifest (deployment.yaml)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: app
          image: myapp:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "250m"
            limits:
              memory: "256Mi"
              cpu: "500m"`, description: "Deployment manifest with resource limits" },
          { code: `# Essential kubectl commands
kubectl apply -f deployment.yaml
kubectl get pods -n default
kubectl describe pod <pod-name>
kubectl logs <pod-name> -f
kubectl exec -it <pod-name> -- sh
kubectl port-forward svc/myapp 3000:80`, description: "Common kubectl operations" },
        ],
      },
      {
        title: "Services, Scaling & Rolling Updates",
        notes: `Services provide stable networking for pods. Since pods are ephemeral (they can be created/destroyed), Services give a permanent IP and DNS name.

Service types:
• ClusterIP (default) — Internal cluster access only
• NodePort — Exposes on each node's IP at a static port
• LoadBalancer — Provisions external load balancer (cloud)

Scaling: Horizontal Pod Autoscaler (HPA) automatically adjusts replicas based on CPU/memory usage. Rolling updates replace pods gradually with zero downtime.`,
        examples: [
          { code: `# Service manifest
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
    - port: 80
      targetPort: 3000`, description: "LoadBalancer Service definition" },
          { code: `# Scaling and updates
kubectl scale deployment myapp --replicas=5
kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=70
kubectl set image deployment/myapp app=myapp:v2
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp`, description: "Scale, autoscale, and rollback" },
        ],
      },
    ],
  },
  {
    id: "aws",
    title: "AWS & Terraform",
    icon: Cloud,
    description: "Cloud infrastructure provisioning and Infrastructure as Code",
    modules: [
      {
        title: "AWS Core Services",
        notes: `Amazon Web Services (AWS) is the leading cloud platform. Key services for DevOps:

Compute:
• EC2 — Virtual servers (instances)
• ECS/EKS — Container orchestration (Docker/Kubernetes)
• Lambda — Serverless functions

Storage:
• S3 — Object storage (files, backups, static websites)
• EBS — Block storage for EC2 instances
• EFS — Shared file system

Database:
• RDS — Managed relational databases (MySQL, PostgreSQL)
• DynamoDB — NoSQL key-value store

Networking:
• VPC — Virtual Private Cloud (isolated network)
• Route 53 — DNS management
• ALB/NLB — Load balancers

IAM (Identity and Access Management) controls who can access what. Always follow the principle of least privilege.`,
        examples: [
          { code: `# AWS CLI examples
aws ec2 describe-instances --filters "Name=tag:Env,Values=prod"
aws s3 ls s3://my-bucket/
aws s3 cp ./backup.tar.gz s3://my-bucket/backups/
aws rds describe-db-instances
aws ecs list-clusters`, description: "Common AWS CLI commands" },
          { code: `# Create an S3 bucket with versioning
aws s3api create-bucket \\
  --bucket my-terraform-state \\
  --region us-east-1
aws s3api put-bucket-versioning \\
  --bucket my-terraform-state \\
  --versioning-configuration Status=Enabled`, description: "Create S3 bucket for Terraform state" },
        ],
      },
      {
        title: "Terraform Infrastructure as Code",
        notes: `Terraform by HashiCorp lets you define infrastructure in declarative configuration files (.tf). It supports AWS, Azure, GCP, and many other providers.

Workflow:
1. terraform init — Initialize providers and modules
2. terraform plan — Preview changes (dry run)
3. terraform apply — Create/update infrastructure
4. terraform destroy — Tear down infrastructure

Key concepts:
• Providers — Plugins for cloud platforms (aws, azurerm, google)
• Resources — Infrastructure objects (aws_instance, aws_s3_bucket)
• Variables — Parameterize configurations
• Outputs — Export values (IP addresses, URLs)
• State — Terraform tracks what it manages in a state file
• Modules — Reusable infrastructure components

Always store state remotely (S3 + DynamoDB) for team collaboration.`,
        examples: [
          { code: `# main.tf — VPC and EC2 instance
provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "main-vpc" }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "\${var.aws_region}a"
  map_public_ip_on_launch = true
}

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  tags = { Name = "web-server" }
}`, description: "Terraform config for VPC and EC2" },
          { code: `# Remote state configuration
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`, description: "Remote state with S3 backend" },
          { code: `# Terraform commands
terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform destroy -auto-approve`, description: "Standard Terraform workflow" },
        ],
      },
    ],
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    icon: Gauge,
    description: "Continuous Integration and Continuous Deployment automation",
    modules: [
      {
        title: "GitHub Actions",
        notes: `GitHub Actions automates workflows directly in your GitHub repository. Workflows are defined in YAML files under .github/workflows/.

Key concepts:
• Workflow — Automated process triggered by events
• Event — What triggers the workflow (push, pull_request, schedule)
• Job — A set of steps that run on the same runner
• Step — Individual task (run a command or use an action)
• Action — Reusable unit of code (e.g., actions/checkout)
• Runner — The machine that executes the job (ubuntu-latest, windows-latest)
• Secrets — Encrypted environment variables for sensitive data

Jobs run in parallel by default. Use "needs" to create dependencies between jobs.`,
        examples: [
          { code: `# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t myapp:\${{ github.sha }} .
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin \$ECR_REGISTRY
          docker push \$ECR_REGISTRY/myapp:\${{ github.sha }}`, description: "Complete CI/CD pipeline with test and deploy" },
        ],
      },
      {
        title: "Jenkins Pipelines",
        notes: `Jenkins is an open-source automation server. Declarative Pipelines define the entire build/test/deploy process in a Jenkinsfile.

Pipeline structure:
• pipeline {} — Top-level block
• agent — Where to run (any, docker, specific node)
• stages — Collection of stage blocks
• stage — Named phase (Build, Test, Deploy)
• steps — Commands to execute
• post — Actions after pipeline (always, success, failure)
• environment — Define environment variables

Jenkins supports plugins for Docker, Kubernetes, Slack notifications, and more. Store the Jenkinsfile in your repository root for Pipeline as Code.`,
        examples: [
          { code: `// Jenkinsfile
pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "myapp"
    REGISTRY = "your-registry.com"
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t \${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER} ."
      }
    }
    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh "docker push \${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER}"
        sh "kubectl set image deployment/myapp app=\${REGISTRY}/\${DOCKER_IMAGE}:\${BUILD_NUMBER}"
      }
    }
  }

  post {
    success { echo 'Pipeline succeeded!' }
    failure { echo 'Pipeline failed!' }
  }
}`, description: "Full Jenkins declarative pipeline" },
        ],
      },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors" title="Copy code">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
    </button>
  );
}

export default function Topics() {
  const [, navigate] = useLocation();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header with Back Button */}
      <div className="relative z-10 border-b border-blue-400/30 bg-gradient-to-r from-blue-900/30 to-blue-800/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:text-blue-300 gap-2 hover:bg-blue-900/30">
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wider">DEVOPS TOPICS</h1>
            <p className="text-white/70 mt-1">Comprehensive lecture notes and hands-on examples</p>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="relative z-5 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isExpanded = expandedTopic === topic.id;
            return (
              <div key={topic.id} className="border border-blue-400/30 rounded-lg bg-gradient-to-br from-blue-900/40 to-blue-800/20 overflow-hidden">
                <button
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-900/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-white tracking-wider">{topic.title}</h2>
                      <p className="text-white/70 text-sm">{topic.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-blue-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {isExpanded && (
                  <div className="border-t border-blue-400/30 px-6 py-4 space-y-4">
                    {topic.modules.map((module, idx) => {
                      const moduleKey = `${topic.id}-${idx}`;
                      const isModuleExpanded = expandedModule === moduleKey;
                      return (
                        <div key={moduleKey} className="bg-blue-900/30 rounded-lg border border-blue-400/20">
                          <button
                            onClick={() => setExpandedModule(isModuleExpanded ? null : moduleKey)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-900/40 transition-colors"
                          >
                            <h3 className="text-lg font-bold text-blue-300 tracking-wide">{module.title}</h3>
                            <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform ${isModuleExpanded ? "rotate-180" : ""}`} />
                          </button>

                          {isModuleExpanded && (
                            <div className="border-t border-blue-400/20 px-4 py-4 space-y-4">
                              {/* Lecture Notes */}
                              <div className="bg-blue-950/40 rounded-lg p-4 border border-blue-400/10">
                                <h4 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">📖 Lecture Notes</h4>
                                <div className="text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{module.notes}</div>
                              </div>

                              {/* Code Examples */}
                              <div>
                                <h4 className="text-blue-300 font-bold text-sm mb-3 uppercase tracking-wider">💻 Code Examples</h4>
                                <div className="space-y-3">
                                  {module.examples.map((example, exIdx) => (
                                    <div key={exIdx}>
                                      {example.description && (
                                        <p className="text-white/60 text-xs mb-1 ml-1">{example.description}</p>
                                      )}
                                      <div className="relative bg-slate-950/80 border border-blue-400/20 rounded-lg px-4 py-3 group">
                                        <CopyButton text={example.code} />
                                        <pre className="text-blue-200/90 text-xs font-mono whitespace-pre-wrap break-words pr-10 overflow-x-auto">
                                          {example.code}
                                        </pre>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
