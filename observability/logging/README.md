Kubernetes observability


helm repo add elastic https://helm.elastic.co

helm install elasticsearch --set replicas=1 --set resources.requests.memory="212Mi" --set resources.requests.cpu="200m" --set persistence.enabled=false --set service.type=NodePort --set service.nodePort=30004 elastic/elasticsearch -n logging


helm install kibana --set service.type=NodePort --set service.nodePort=30005 --set resources.requests.memory="200Mi" --set resources.requests.cpu="200m"  elastic/kibana -n logging