# 🚀 ELK Stack Deployment with Helm

This repository provides a **step-by-step guide** to deploy the **ELK Stack** — Elasticsearch, Logstash, and Kibana — in a Kubernetes cluster using [Helm](https://helm.sh).  
The instructions cover repository setup, namespace creation, chart installation, configuration, and validation commands.

## Components needed

- ElasticSearch
- Kibana
- Logstash
- Filebeat

## Add Helm Repositories for elasticsearch, kibana, Logstash and Filebeat

```bash
# Add this repo using helm and do update
helm repo add elastic https://helm.elastic.co
helm repo update
```

---

## Setup ElasticSearch as **StatefulSet** for storing logs and create index

```bash
# Install ElasticSearch using helm
helm upgrade --install elasticsearch elastic/elasticsearch \
-n logging -f values/elasticsearch-values.yaml
```

### Get username and password of ElasticSearch for fluent-bit

```bash
# Retrieve the username for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d

# Retrieve the password for the ElasticSearch
kubectl get secrets -n logging elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
```

## Setup Kibana as **Deployment** for visulizing log in dashboard

```bash
# Install Kibana using helm
helm upgrade --install kibana elastic/kibana \
-n logging -f values/kibana-values.yaml
```

## Setup Logstash as **StatefulSet** for process data before sending to ElasticSearch

```bash
# Install logstash using helm
helm upgrade --install logstash elastic/logstash \
-f values/logstash-values.yaml -n logging
```

## Setup Filebeat as **DaemonSet** for exporting log from every node

```bash
# Install Filebeat using helm
helm upgrade --install filebeat elastic/filebeat \
-f values/filebeat-values.yaml -n logging
```

Verify the setup to view the kibana dashboard on port 30001
