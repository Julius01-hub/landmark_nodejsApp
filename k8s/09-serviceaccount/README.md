# ServiceAccount & RBAC

## What is a ServiceAccount?

A ServiceAccount provides an identity for pods running in the cluster. It controls what Kubernetes API actions a pod is allowed to perform via RBAC (Role-Based Access Control).

**Three objects work together:**
- `ServiceAccount` — The identity assigned to a pod
- `Role` — Defines what actions are allowed (get, list, create, delete) on which resources
- `RoleBinding` — Connects a Role to a ServiceAccount

**Cluster-level equivalents:**
- `ClusterRole` — Like Role but applies across all namespaces
- `ClusterRoleBinding` — Binds a ClusterRole to a ServiceAccount

## Syntax

```yaml
# ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: landmark-app

---
# Role — what is allowed
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]

---
# RoleBinding — who gets the permissions
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
roleRef:
  kind: Role
  name: landmark-app-role
subjects:
  - kind: ServiceAccount
    name: landmark-app
```

**Using in a pod:**
```yaml
spec:
  serviceAccountName: landmark-app
```

## How to Run

```bash
kubectl apply -f serviceaccount.yaml

# Verify
kubectl get serviceaccounts -n landmark-devops
kubectl get roles -n landmark-devops
kubectl get rolebindings -n landmark-devops
```

## How to Access

```bash
# Check what a ServiceAccount can do
kubectl auth can-i get configmaps --as=system:serviceaccount:landmark-devops:landmark-app -n landmark-devops

# Describe the role to see permissions
kubectl describe role landmark-app-role -n landmark-devops
```

## Troubleshooting

```bash
# Pod getting "Forbidden" errors
kubectl describe pod <pod-name> -n landmark-devops
# Check: is serviceAccountName set correctly?
# Check: does the Role have the right verbs and resources?

# List all permissions for a ServiceAccount
kubectl auth can-i --list --as=system:serviceaccount:landmark-devops:landmark-app -n landmark-devops
```

## Key Points

- Every namespace has a `default` ServiceAccount (with minimal permissions)
- Always create dedicated ServiceAccounts for your apps
- Follow the principle of least privilege — only grant what's needed
- Role/RoleBinding = namespace-scoped, ClusterRole/ClusterRoleBinding = cluster-wide
