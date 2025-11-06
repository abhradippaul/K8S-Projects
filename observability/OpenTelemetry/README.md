# Setup OpenTelemetry in Kubernetes

## 📋 Prerequisites

- `helm` v3 or later installed locally.
- `Kubernetes` setup

---

## Components needed

- OpenTelemetry
- Loki
- Tempo
- Grafana

## Helm Repositories

Add Helm Repositories for OpenTelemetry, Loki, and Promtail

```bash
# Add this repo using helm and do update
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo add prom https://prometheus-community.github.io/helm-charts
helm repo update
```

## ### Namespace logging, monitoring, traces

```bash
# Create a namespace for traces
kubectl create ns logging
kubectl create ns monitoring
kubectl create ns traces
```

## OpenTelemetry

Setup OpenTelemetry as **DaemonSet** for exporting log from every node

```bash
# Create promtail resource using helm
helm upgrade --install my-otel-demo open-telemetry/opentelemetry-demo \
-n traces
# -f values/opentelemetry-values.yaml
```

## Loki

Install Loki as **StatefulSet** which will collect log from Promtail

```bash
# Create loki resource using helm
helm upgrade --install loki grafana/loki -n logging \
-f values/loki-values.yaml
```

## Tempo

Install Tempo as **StatefulSet** which will store the trace data from Loki

```bash
# Create tempo resource using helm
helm upgrade --install tempo grafana/tempo -n traces \
-f values/tempo-values.yaml
```

## Grafana

Install Grafana as **DaemonSet** which will visualize all information

```bash
# Install kube-prometheus-stack (release name: grafana)
helm upgrade --install grafana prom/kube-prometheus-stack \
-n monitoring -f values/grafana-values.yaml
```
