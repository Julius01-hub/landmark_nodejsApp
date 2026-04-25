# Kubernetes - Orchestration Guide

## Quick Start

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/01-namespace.yaml

# Create ConfigMap and Secret
kubectl apply -f k8s/02-configmap-secret.yaml

# Deploy application
kubectl apply -f k8s/03-deployment.yaml

# Create services
kubectl apply -f k8s/04-service.yaml

# Deploy database (StatefulSet)
kubectl apply -f k8s/05-statefulset.yaml
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n landmark-devops

# Check services
kubectl get svc -n landmark-devops

# Check deployment status
kubectl describe deployment landmark-app -n landmark-devops
```

### Access Application

```bash
# Port forward to access locally
kubectl port-forward svc/landmark-app-lb 3000:80 -n landmark-devops

# Get load balancer endpoint (if using cloud provider)
kubectl get svc landmark-app-lb -n landmark-devops -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

## Kubernetes Manifests

### 01-namespace.yaml
Creates isolated namespace for the application.

### 02-configmap-secret.yaml
Stores configuration and secrets for the application.

### 03-deployment.yaml
Manages application replicas with 2 replicas by default.

### 04-service.yaml
Exposes the application with ClusterIP and LoadBalancer services.

### 05-statefulset.yaml
Manages MySQL database with persistent storage.

## Key Concepts

- **Namespace**: Logical isolation for resources
- **Deployment**: Manages application replicas
- **Service**: Network access to pods
- **StatefulSet**: Manages stateful applications like databases
- **ConfigMap**: Non-sensitive configuration
- **Secret**: Sensitive data like passwords
- **PersistentVolume**: Persistent storage for databases

## Cleanup

```bash
# Delete all resources
kubectl delete namespace landmark-devops
```

## Teaching Points

- **Pod**: Smallest deployable unit in Kubernetes
- **Deployment**: Declarative updates for pods
- **Service Discovery**: DNS-based service discovery
- **State Persistence**: StatefulSets for databases
- **Configuration Management**: ConfigMaps and Secrets
- **Scaling**: Horizontal pod autoscaling
