# 🚀 Setup Loki with Helm

<img width="1576" height="927" alt="diagram-export-5-11-2025-12_23_07-pm" src="https://github.com/user-attachments/assets/77798594-08a4-4e2b-ab50-b4d987f66964" />

## Components needed

- Grafana
- Loki
- Promtail

## Helm Repositories

Add Helm Repositories for Grafana, Loki, and Promtail

```bash
# Add this repo using helm and do update
helm repo add loki https://grafana.github.io/helm-charts
helm repo add prom https://prometheus-community.github.io/helm-charts
helm repo update
```

### Namespace logging, monitoring

```bash
# Create the namespace
kubectl create ns logging
kubectl create ns monitoring
```

## Promtail

Setup Promtail as **DaemonSet** for exporting log from every node

```bash
# Create promtail resource using helm
helm upgrade --install promtail loki/promtail \
-n logging -f values/promtail-values.yaml
```

## Loki

Install Loki as **Deployment** which will collect log from Promtail

```bash
# Create loki resource using helm
helm upgrade --install loki loki/loki -n logging \
-f values/loki-values.yaml
```

## Grafana

Install Grafana as **Deployment** to visualize the logs

```bash
# Install kube-prometheus-stack (release name: grafana)
helm upgrade --install grafana prom/kube-prometheus-stack \
-n monitoring -f values/grafana-values.yaml
```

Check logs in grafana
