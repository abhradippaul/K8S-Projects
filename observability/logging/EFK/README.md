# 🚀 EFK Stack Deployment with Helm

This repository provides a **step-by-step guide** to deploy the **EFK Stack** — Elasticsearch, Fluent Bit, and Kibana — in a Kubernetes cluster using [Helm](https://helm.sh).  
The instructions cover repository setup, namespace creation, chart installation, configuration, and validation commands.

## Components needed

- Elasticsearch
- Kibana
- Fluent Bit

## Helm Repositories

Add Helm Repositories for elasticsearch, kibana and Fluent Bit

```bash
# Add this repo using helm and do update
helm repo add elastic https://helm.elastic.co
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

### Namespace logging

```bash
# Create namespace logging
kubectl create ns logging
```

## ElasticSearch

Setup ElasticSearch as **StatefulSet** for storing logs and create index

```bash
# Install ElasticSearch using helm
helm upgrade --install elasticsearch elastic/elasticsearch \
-n logging -f values/elasticsearch-values.yaml
```

### Username and Password

Get username and password of ElasticSearch for fluent-bit

```bash
# Retrieve the username for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d

# Retrieve the password for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

## Kibana

Setup Kibana as **Deployment** for visulizing log in dashboard

```bash
# Install Kibana using helm
helm upgrade --install kibana elastic/kibana \
-n logging -f values/kibana-values.yaml
```

## FluentBit

Setup FluentBit as **DaemonSet** for exporting log from every nodes

```bash
# Install fluent bit using helm
helm upgrade --install fluent-bit fluent/fluent-bit \
-f values/fluentbit-values.yaml -n logging
```

### Fake Logger

Deploye a fake logging application to utilize logging

```bash
# Apply this deployment
kubectl apply -f fake-metrics-logs.yaml
```
