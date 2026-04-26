# ConfigMap & Secret

## What is a ConfigMap?

A ConfigMap stores non-sensitive configuration data as key-value pairs. It decouples configuration from container images so you can change settings without rebuilding.

## What is a Secret?

A Secret stores sensitive data (passwords, tokens, keys). Secrets are base64-encoded (not encrypted by default) and can be encrypted at rest with additional configuration.

## Syntax

```yaml
# ConfigMap — non-sensitive config
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: production

---
# Secret — sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:                          # stringData auto-encodes to base64
  DATABASE_URL: mysql://user:pass@db:3306/mydb
```

**Using them in a pod:**
```yaml
spec:
  containers:
    - name: app
      envFrom:
        - configMapRef:
            name: app-config       # All keys become env vars
        - secretRef:
            name: app-secrets      # All keys become env vars
```

## How to Run

```bash
kubectl apply -f configmap-secret.yaml

# Verify
kubectl get configmaps -n landmark-devops
kubectl get secrets -n landmark-devops
```

## How to Access

```bash
# View ConfigMap data
kubectl describe configmap app-config -n landmark-devops

# View Secret data (base64 encoded)
kubectl get secret app-secrets -n landmark-devops -o yaml

# Decode a secret value
kubectl get secret app-secrets -n landmark-devops -o jsonpath='{.data.DATABASE_URL}' | base64 -d
```

## Troubleshooting

```bash
# Pod can't find ConfigMap/Secret
kubectl describe pod <pod-name> -n landmark-devops
# Look for: "configmaps not found" or "secrets not found"
# Fix: make sure the ConfigMap/Secret exists in the same namespace

# Create a secret from the command line
kubectl create secret generic app-secrets \
  --from-literal=DATABASE_URL='mysql://user:pass@db:3306/mydb' \
  -n landmark-devops
```

## Key Points

- ConfigMap = non-sensitive config, Secret = sensitive data
- `stringData` in Secrets auto-encodes to base64 (easier to write)
- `data` in Secrets requires you to provide base64-encoded values
- Secrets are NOT encrypted by default — enable encryption at rest in production
- Never commit real secrets to Git — use sealed-secrets or external secret managers
