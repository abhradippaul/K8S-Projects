# AKS Observability — Prometheus & Grafana (kube-prometheus-stack)

This guide provides step-by-step instructions for installing **Prometheus** and **Grafana** on an **Azure Kubernetes Service (AKS)** cluster using **Helm**.

> **Note:** The commands below use `k` as an alias for `kubectl`. If you don't have this alias set, replace `k` with `kubectl`.

---

## 📋 Prerequisites

- `kubectl` configured for your AKS cluster.
- `helm` v3 or later installed locally.
- Sufficient permissions to create namespaces, RBAC objects, and services.
- Available Azure LoadBalancer public IP quota.

---

## 🚀 Quick Start Commands

```bash
# Add Prometheus Helm repo and update
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
```
<img width="772" height="151" alt="Screenshot 2025-08-10 225428" src="https://github.com/user-attachments/assets/b341a694-cfa9-4764-9db8-ab2ec9652e3b" />


```bash
# Create namespace for monitoring components
k create ns monitoring

# Install kube-prometheus-stack (release name: prometheus)
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring

# List Helm releases
helm list -n monitoring
```
<img width="1491" height="91" alt="Screenshot 2025-08-10 225455" src="https://github.com/user-attachments/assets/878d6788-85d0-4f73-aaf4-5c9a36a8b7b7" />


```bash
# Watch pods until they are running
k get pods -n monitoring -w

# Check services
k get svc -n monitoring

k get all -n monitoring
```
<img width="1394" height="721" alt="Screenshot 2025-08-10 225944" src="https://github.com/user-attachments/assets/d0380d57-cea3-4a32-a396-a2f5b9075a67" />


```bash
# Edit Grafana service to use LoadBalancer
k edit svc -n monitoring prometheus-grafana
# Change: spec.type: ClusterIP -> LoadBalancer

# Verify updated service
k get svc -n monitoring
```

<img width="950" height="990" alt="Screenshot 2025-08-10 230130" src="https://github.com/user-attachments/assets/a0cabfee-d9cd-4588-9259-08fa416744e9" />
<img width="942" height="986" alt="Screenshot 2025-08-10 225355" src="https://github.com/user-attachments/assets/55322bd6-9cec-4f59-83b8-6883c723a8d7" />
