# Volumes: PersistentVolume, PersistentVolumeClaim & StorageClass

## What are Volumes?

Containers are ephemeral — when a pod dies, its data is lost. Volumes provide persistent storage that survives pod restarts and rescheduling.

**Three objects work together:**
- `PersistentVolume (PV)` — The actual storage resource (a disk, NFS share, cloud volume)
- `PersistentVolumeClaim (PVC)` — A request for storage by a pod ("I need 20Gi of storage")
- `StorageClass` — Defines how PVs are dynamically provisioned (e.g., AWS EBS gp3)

**Access modes:**
- `ReadWriteOnce (RWO)` — Mounted read-write by a single node
- `ReadOnlyMany (ROX)` — Mounted read-only by many nodes
- `ReadWriteMany (RWX)` — Mounted read-write by many nodes (requires NFS/EFS)

## Syntax

```yaml
# PV — the storage itself
apiVersion: v1
kind: PersistentVolume
metadata:
  name: landmark-db-pv
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  hostPath:
    path: /mnt/data/landmark-db

---
# PVC — the request for storage
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: landmark-db-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

**Using a PVC in a pod:**
```yaml
spec:
  containers:
    - name: db
      volumeMounts:
        - name: db-data
          mountPath: /var/lib/mysql
  volumes:
    - name: db-data
      persistentVolumeClaim:
        claimName: landmark-db-pvc
```

## How to Run

```bash
kubectl apply -f pv-pvc-storageclass.yaml

# Verify
kubectl get pv
kubectl get pvc -n landmark-devops
kubectl get storageclass
```

## How to Access

```bash
# Check PVC binding status
kubectl get pvc -n landmark-devops
# STATUS should be "Bound"

# See which PV a PVC is bound to
kubectl describe pvc landmark-db-pvc -n landmark-devops
```

## Troubleshooting

```bash
# PVC stuck in Pending
kubectl describe pvc landmark-db-pvc -n landmark-devops
# Common causes:
#   - No matching PV available
#   - StorageClass doesn't exist
#   - Insufficient storage capacity

# PV stuck in Released (after PVC deleted)
kubectl patch pv landmark-db-pv -p '{"spec":{"claimRef": null}}'

# Check storage class exists
kubectl get storageclass
```

## Key Points

- PV = the disk, PVC = the request, StorageClass = the provisioner
- `Retain` reclaim policy keeps data after PVC is deleted
- `Delete` reclaim policy destroys the volume when PVC is deleted
- With a StorageClass, PVs are created automatically when a PVC is made (dynamic provisioning)
- `hostPath` is for local dev only — use cloud volumes (EBS, EFS) in production
