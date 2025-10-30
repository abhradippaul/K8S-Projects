# Setup Tracing in Kubernetes

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
```

```bash
# Add this repo using helm and do update
helm repo add jaegertracing https://jaegertracing.github.io/helm-charts
helm repo update
```

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
