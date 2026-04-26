# Service

## What is a Service?

A Service provides a stable network endpoint to access a set of pods. Since pods are ephemeral (they get new IPs when recreated), a Service gives you a permanent IP and DNS name that routes traffic to healthy pods.

**Service types:**
- `ClusterIP` (default) — Internal access only, reachable within the cluster
- `NodePort` — Exposes the service on each node's IP at a static port (30000-32767)
- `LoadBalancer` — Provisions an external load balancer (cloud providers like AWS, GCP)

## Syntax

```yaml
apiVersion: v1
kind: Service
metadata:
  name: landmark-app
spec:
  type: ClusterIP        # or NodePort, LoadBalancer
  selector:
    app: landmark-app    # Must match pod labels
  ports:
    - port: 80           # Service port (what clients connect to)
      targetPort: 3000   # Container port (where the app listens)
```

**Key fields:**
- `selector` — Finds pods with matching labels to route traffic to
- `port` — The port the Service listens on
- `targetPort` — The port on the container the traffic is forwarded to
- `nodePort` — (NodePort only) The static port on each node (30000-32767)

## How to Run

```bash
# Apply the deployment and all three service types
kubectl apply -f deployment-service.yaml

# Verify
kubectl get services -n landmark-devops
kubectl get endpoints -n landmark-devops
```

## How to Access

```bash
# ClusterIP — access via port-forward
kubectl port-forward svc/landmark-app 3000:80 -n landmark-devops
# Open http://localhost:3000

# NodePort — access via any node IP
# http://<node-ip>:30080

# LoadBalancer — access via external IP
kubectl get svc landmark-app-lb -n landmark-devops
# Use the EXTERNAL-IP shown in the output
```

## Troubleshooting

```bash
# Check if service has endpoints (pods backing it)
kubectl get endpoints landmark-app -n landmark-devops
# If endpoints are empty: selector labels don't match any running pods

# Describe service
kubectl describe svc landmark-app -n landmark-devops

# Test from inside the cluster
kubectl run test --rm -it --image=busybox -- wget -qO- http://landmark-app.landmark-devops.svc.cluster.local

# Common issues:
#   - No endpoints: selector doesn't match pod labels
#   - Connection refused: targetPort doesn't match container port
#   - Pending external IP: cloud provider LB not provisioned yet
```

## Key Points

- Services use `selector` to find pods — labels MUST match
- ClusterIP for internal, NodePort for dev/testing, LoadBalancer for production
- DNS format inside cluster: `<service-name>.<namespace>.svc.cluster.local`
- A Service without a selector can point to external endpoints
