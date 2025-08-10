Kubernetes monitoring using grafana and prometheus


helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install prometheus-community -f values.yaml prometheus-community/kube-prometheus-stack -n monitoring