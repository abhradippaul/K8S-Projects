## Setup Loki for log aggregation and visualization

### Install Promtail which exports log from every node

```bash
# Add this repo using helm and do update
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Create promtail resource using helm
helm install promtail grafana/promtail \
-n monitoring -f loki/promtail-config.yaml
```

### Install Loki which will collect log from Promtail

```bash
# Create loki resource using helm
helm install loki grafana/loki-distributed -n monitoring
```

```bash
# Install prometheus-blackbox-exporter (release name: blackbox-exporeter)
helm upgrade --install blackbox-exporeter prometheus-community/prometheus-blackbox-exporter \
-n monitoring -f values/blackbox-exporter.yaml
```
