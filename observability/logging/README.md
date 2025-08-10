Kubernetes observability


helm repo add elastic https://helm.elastic.co
k create ns log
helm install elasticsearch elastic/elasticsearch   --set replicas=1   --set resources.requests.memory="512Mi"   --set resources.requests.cpu="500m"   --set persistence.enabled=true   --set service.type=LoadBalancer -n log
k get pods -n log -w
k get pv
k get pvc
k get svc -n log
helm install kibana --set service.type=LoadBalancer elastic/kibana -n log
kubectl get secrets -n log elasticsearch-master-credentials -ojsonpath='{.data.password}' | base64 -d
kubectl get secrets -n log elasticsearch-master-credentials -ojsonpath='{.data.username}' | base64 -d
helm repo add fluent https://fluent.github.io/helm-charts
helm show values fluent/fluent-bit > fluentbit-values.yaml
vim fluentbit-values.yaml

helm install fluent-bit fluent/fluent-bit -f fluentbit-values.yaml -n log


k get pods -n log -w
k get svc -n log

<img width="1917" height="912" alt="Screenshot 2025-08-10 232730" src="https://github.com/user-attachments/assets/94cbaf08-4a0c-4b75-ac91-26bceab51026" />
<img width="1407" height="133" alt="Screenshot 2025-08-10 230529" src="https://github.com/user-attachments/assets/7d35d471-46f2-44ef-8654-39d5882796f2" />
<img width="1290" height="494" alt="Screenshot 2025-08-10 230604" src="https://github.com/user-attachments/assets/aaba247c-8a16-41e5-a0fd-a1f8b1fb7a26" />
<img width="951" height="993" alt="Screenshot 2025-08-10 230641" src="https://github.com/user-attachments/assets/3ad273fc-5f30-4252-a556-c0c130aba960" />
