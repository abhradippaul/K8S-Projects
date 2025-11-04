# Monitoring — (kube-prometheus-stack)

This guide provides step-by-step instructions for installing **Prometheus**, **Grafana**, **Prometheus Mongodb Exporter** and **Prometheus Blackbox Exporter** on an Kubernetes cluster using **Helm**.

---

## 📋 Prerequisites

- `helm` v3 or later installed locally.
- `Kubernetes` setup

---

## Components needed

- Prometheus
- Grafana
- Prometheus Mongodb Exporter
- Prometheus Blackbox Exporter

Node Exporter + Kube State Metrics -> Prometheus -> Grafana

```bash
# Goto the monitoring folder
cd monitoring
```

## Add Helm repo

Using helm repo setup Prometheus, Grafana, Prometheus Mongodb Exporter, Prometheus Blackbox Exporter

```bash
# Add Prometheus Helm repo and update
helm repo add prom https://prometheus-community.github.io/helm-charts
helm repo update
```

### Namespace monitoring

```bash
# Create namespace for deploy monitoring resources
kubectl create ns monitoring
```

## Grafana, Prometheus and Alert Manager

Setup as **Deployment** for monitoring and scrape metrics

```bash
# Install kube-prometheus-stack (release name: prometheus)
helm upgrade --install prometheus prom/kube-prometheus-stack \
-n monitoring -f values/prom-values.yaml

# List Helm releases
helm list -n monitoring
```

Get username and password of Grafana

```bash
# Check the admin-password
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d

# Check the admin-user
kubectl get secret -n monitoring prometheus-grafana -o jsonpath="{.data.admin-user}" | base64 -d
```

Import **1860** dashboard to visualize node metrics

Import **15661** dashboard to visualize kubernetes cluster

## Alerts

### Upgrade Helm Chart

For setup alert we need to upgrade the helm release with new configuration

```bash
# Upgrade the helm release
helm upgrade --install prometheus prom/kube-prometheus-stack \
-n monitoring -f values/prom-alert-values.yaml
```

### Grafana Based Alerts

In Grafana dashboard

- Create alert using PromQL Query with label
- Create contact point
- Create notification policy

PromQL Query:-

- kube_pod_container_status_waiting_reason{namespace="default", reason="ImagePullBackOff"}
- kube_pod_container_status_restarts_total{namespace="default"}

### Alert Manager Based Alerts

The Alert Manager already configured by the prom-alert-values.
We need to configure the prometheus rule to create custom rule

```bash
# Apply the custom prometheus rule
kubectl apply -f custom-alert-rules.yaml
```

## Setup Monitoring MongoDB

### Create mongodb pod

```bash
# Apply the command to create mongodb pod
kubectl apply -f mongodb-database.yaml
```

## Prometheus Mongodb Exporter

Setup as **Deployment** for exporting metrics of mongodb pods

```bash
# Install prometheus-mongodb-exporter (release name: mongodb-exporter)
helm upgrade --install mongodb-exporter prom/prometheus-mongodb-exporter \
-n monitoring -f values/mongodb-exporter-values.yaml
```

Check on the prometheus if the target is coming or not
After that check on grafana explore section

Import **20867** dashboard to visualize mongodb

### Blackbox Exporter

For monitor HTTP and HTTPS endpoints we need to upgrade the helm release with new configuration

```bash
# Upgrade the helm release
helm upgrade --install prometheus prom/kube-prometheus-stack \
-n monitoring -f values/prom-blackbox-values.yaml
```

Setup as **Deployment** to monitor HTTP or HTTPS endpoint

```bash
# Install prometheus-blackbox-exporter (release name: blackbox-exporter)
helm upgrade --install blackbox-exporter prom/prometheus-blackbox-exporter \
-n monitoring -f values/blackbox-exporter-values.yaml

# List Helm releases
helm list -n monitoring
```

Import **7587** dashboard to visualize Prometheus Blackbox Exporter metrics
