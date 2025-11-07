# Setup Tracing with Jaeger in Kubernetes

## 📋 Prerequisites

- `helm` v3 or later installed locally.
- `Kubernetes` setup

## Components needed

- ElasticSearch
- Jaeger

## Namespace traces

Install Jaegar to instrumate traces

```bash
# Create a namespace for traces
kubectl create ns traces
```

### Helm Repositories

Add Helm Repositories for ElasticSearch, Jaeger

```bash
# Add this repo using helm and do update
helm repo add elastic https://helm.elastic.co
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo update
```

## ElasticSearch

Setup ElasticSearch as **StatefulSet** for storing traces for Jaeger

```bash
# Create ElasticSearch resource using helm
helm upgrade --install elasticsearch elastic/elasticsearch \
-n traces -f values/elasticsearch-values.yaml
```

### Username and Password

Get username and password of ElasticSearch for Jaeger

```bash
# Retrieve the username for the ElasticSearch
kubectl get secrets -n traces elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d

# Retrieve the password for the ElasticSearch
kubectl get secrets -n traces elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

### Setup ca cert of elasticsearch for jaeger

```bash
# Get the secret of elasticsearch master certs and save to ca-cert.pem file
kubectl get secret elasticsearch-master-certs -n traces -o jsonpath='{.data.ca\.crt}' | base64 -d > ca-cert.pem

# Create a configmap using ca-cert.pem file
kubectl create cm jaeger-tls --from-file=ca-cert.pem -n traces

# Create secret for ElasticSearch
kubectl create secret generic es-tls-secret \
--from-file=ca-cert.pem \
-n traces
```

## Jaeger

Setup Jaeger agent, collector and query for exporting, collecting and quering the tracing

```bash
# Create Jaeger resource using helm
helm upgrade --install jaeger jaegertracing/jaeger -n traces \
-f values/jaeger-values.yaml
```

Verify the NodePort for the Jaeger Query
