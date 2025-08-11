## Connecting to AKS Cluster

This project sets up observability for a Kubernetes cluster deployed on **Azure Kubernetes Service (AKS)**.  
It includes monitoring, alerting, and logging components deployed via **Helm charts**.

---

## Monitoring with Prometheus & Grafana

- **Prometheus** is deployed to collect metrics from Kubernetes components, workloads, and infrastructure.
- **Grafana** is deployed for visualization and dashboards.
- Installation is done using **Helm** for easy deployment and configuration.
- Grafana is exposed using a **LoadBalancer** service.
- You can access Grafana via: http://<-grafana-loadbalancer-ip->:80
*(Default login: `admin` / `admin` unless changed during deployment)*

---

## Logging with Elasticsearch, Fluent Bit, and Kibana (EFK Stack)

- **Fluent Bit** is deployed as a DaemonSet to collect logs from all pods and forward them to Elasticsearch.
- **Elasticsearch** stores and indexes logs for search and analysis.
- **Kibana** provides a UI for log exploration and visualization.
- The EFK stack is installed using **Helm**.
- Kibana is exposed using a **LoadBalancer** service.
- You can access Kibana via:


Before working with the Kubernetes cluster, configure your Azure subscription and retrieve cluster credentials.

```bash
# Set the Azure subscription
az account set --subscription <subscription-id>

# Get AKS cluster credentials
az aks get-credentials \
    --resource-group <resource-group-name> \
    --name <cluster-name> \
    --overwrite-existing

# Verify the Kubernetes context
kubectl config get-contexts

# List namespaces in the cluster
kubectl get ns
```
