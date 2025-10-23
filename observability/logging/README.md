# 🚀 EFK Stack Deployment with Helm

This repository provides a **step-by-step guide** to deploy the **EFK Stack** — Elasticsearch, Fluent Bit, and Kibana — in a Kubernetes cluster using [Helm](https://helm.sh).  
The instructions cover repository setup, namespace creation, chart installation, configuration, and validation commands.

---

## 📋 Prerequisites

Before starting, ensure you have:

- A working Kubernetes cluster
- `kubectl` and `helm` installed
- Sufficient permissions to create namespaces and install Helm charts

---

## 1️⃣ Add Helm Repositories

```
helm repo add elastic https://helm.elastic.co
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

---

## 3️⃣ Install Elasticsearch

```
helm install elasticsearch elastic/elasticsearch
--set replicas=1
--set resources.requests.memory="512Mi"
--set resources.requests.cpu="500m"
--set persistence.enabled=true
--set service.type=LoadBalancer
-n log
```

**Notes:**

- Deploys a **single-node Elasticsearch** with persistent storage.
- Service type is **LoadBalancer** for external access.

**Check Deployment:**

```
kubectl get pods -n log -w
kubectl get pv
kubectl get pvc
kubectl get svc -n log
```

---

## 4️⃣ Install Kibana

```
helm install kibana elastic/kibana
--set service.type=LoadBalancer
-n log
```

**Check Deployment:**

```
kubectl get pods -n log -w
kubectl get svc -n log
```

---

## 5️⃣ Get Elasticsearch Credentials

```
kubectl get secrets -n log elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
kubectl get secrets -n log elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d
```

These credentials are needed when configuring **Fluent Bit**.

---

## 6️⃣ Configure Fluent Bit

Fetch default configuration:

```
helm show values fluent/fluent-bit > fluentbit-values.yaml
```

```
Edit `fluentbit-values.yaml` to configure:
- **Elasticsearch output** (host, username, password)
- **Input sources** (tail logs, systemd, etc.)
- **Parsers / Filters** for log formats
```

```
vim fluentbit-values.yaml
```

---

## 7️⃣ Install Fluent Bit

```
helm install fluent-bit fluent/fluent-bit
-f fluentbit-values.yaml
-n log
```

**Check Deployment:**

```
kubectl get pods -n log -w
kubectl get svc -n log
helm list -n log
```

<img width="1407" height="133" alt="Screenshot 2025-08-10 230529" src="https://github.com/user-attachments/assets/7d35d471-46f2-44ef-8654-39d5882796f2" />
<img width="1290" height="494" alt="Screenshot 2025-08-10 230604" src="https://github.com/user-attachments/assets/aaba247c-8a16-41e5-a0fd-a1f8b1fb7a26" />

---

## 🛠 Troubleshooting Tips

- Ensure all pods are in **Running** state.
- If pods are stuck in `Pending`, check for resource quota or storage issues.
- Debug using `kubectl logs <pod-name> -n log`.
- Access Kibana using the LoadBalancer IP to visualize logs.

---

## 📚 References

- [Elastic Helm Charts Documentation](https://github.com/elastic/helm-charts)
- [Fluent Bit Helm Chart Documentation](https://github.com/fluent/helm-charts)

---

✨ **You now have a working EFK stack deployed with Helm!**

<img width="1917" height="912" alt="Screenshot 2025-08-10 232730" src="https://github.com/user-attachments/assets/94cbaf08-4a0c-4b75-ac91-26bceab51026" />
<img width="951" height="993" alt="Screenshot 2025-08-10 230641" src="https://github.com/user-attachments/assets/3ad273fc-5f30-4252-a556-c0c130aba960" />

### Install Java

sudo apt update && sudo apt install openjdk 17-jre-headless -y

### Install Elasticsearch

wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update
sudo apt install elastic-search -y

### Configure Elasticsearch

sudo vim /etc/elasticsearch/elasticsearch.yml
Modify:
network.host: 0.0.0.0
cluster.name: my-cluster
node.name: node 1
discovery.type: single-node

### Start and enable Elasticsearch

sudo systemctl enable --now elasticsearch

### Verify Elasticsearch

curl -X GET "http://localhost:9200"

## Install and configure logstash

sudo apt install logstash -y
