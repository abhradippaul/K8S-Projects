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

### 1️⃣ Add Helm Repositories for elasticsearch and kibana

```bash
# Add this repo using helm and do update
helm repo add elastic https://helm.elastic.co
helm repo update
```

---

### Setup ElasticSearch for Database

```bash
# Create ElasticSearch resource
helm install elasticsearch elastic/elasticsearch \
-n logging -f values/elasticsearch-values.yaml

# Retrieve the username for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d

# Retrieve the password for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

These credentials are needed when configuring **Fluent Bit**.

**Notes:**

- Deploys a **single-node Elasticsearch** with persistent storage.
- Service type is **NodePort** for external access.

---

## 4️⃣ Install Kibana

```bash
helm install kibana elastic/kibana \
-n logging -f values/kibana-values.yaml
```

**Check Deployment:**

```
kubectl get pods -n log -w
kubectl get svc -n log
```

---

### 1️⃣ Add Helm Repositories for elasticsearch and kibana

```bash
# Add this repo using helm and do update
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

### 6️⃣ Configure Fluent Bit

```bash
# Install fluent bit using helm
helm install fluent-bit fluent/fluent-bit \
-f values/fluentbit-values.yaml -n logging
```

<img width="1407" height="133" alt="Screenshot 2025-08-10 230529" src="https://github.com/user-attachments/assets/7d35d471-46f2-44ef-8654-39d5882796f2" />
<img width="1290" height="494" alt="Screenshot 2025-08-10 230604" src="https://github.com/user-attachments/assets/aaba247c-8a16-41e5-a0fd-a1f8b1fb7a26" />

---

✨ **You now have a working EFK stack deployed with Helm!**

<img width="1917" height="912" alt="Screenshot 2025-08-10 232730" src="https://github.com/user-attachments/assets/94cbaf08-4a0c-4b75-ac91-26bceab51026" />
<img width="951" height="993" alt="Screenshot 2025-08-10 230641" src="https://github.com/user-attachments/assets/3ad273fc-5f30-4252-a556-c0c130aba960" />
