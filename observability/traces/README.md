# Setup Tracing in Kubernetes

## 📋 Prerequisites

- `helm` v3 or later installed locally.
- `Kubernetes` setup

---

## Components needed

- Prometheus
- Grafana
- Prometheus Mongodb Exporter
- Prometheus Blackbox Exporter

## Install Jaegar to instrumate traces

```bash
# Create a namespace for traces
kubectl create ns traces
```

### Setup ElasticSearch for Jaeger Database

```bash
# Add this repo using helm and do update
helm repo add elastic https://helm.elastic.co
helm repo update

# Create ElasticSearch resource
helm install elasticsearch elastic/elasticsearch \
-n traces -f values/elastic-search/elasticsearch-values.yaml

# Retrieve the username for the ElasticSearch
kubectl get secrets -n traces elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d

# Retrieve the password for the ElasticSearch
kubectl get secrets -n traces elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

### Setup ca cert of elasticsearch for jaeger

```bash
# Get the secret of elasticsearch master certs and save to ca-cert.pem file
kubectl get secret elasticsearch-master-certs -n traces -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca-cert.pem

# Create a configmap using ca-cert.pem file
kubectl create cm jaeger-tls --from-file=ca-cert.pem -n traces
```

```bash
# Add this repo using helm and do update
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo update

# Create Jaeger resource using helm
helm install jaeger jaegertracing/jaeger -n traces \
-f values/jaeger/jaeger-values.yaml
```

Verify the NodePort for the Jaeger Query

### Install Promtail which exports log from every node

```bash
# Add this repo using helm and do update
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create promtail resource using helm
helm install loki grafana/loki-stack -n monitoring \
-f values/lokistack-values.yaml

# Create tempo resource using helm
helm install tempo grafana/tempo -n monitoring
```
