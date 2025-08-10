Kubernetes monitoring using grafana and prometheus


helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
k create ns monitoring
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
k get pods -n monitoring -w
k get svc -n monitoring
k edit svc -n monitoring kube-prometheus-stack-Grafana -n monitoring / k edit svc -n monitoring prometheus-grafana -> Edit to LoadBalancer
k get svc -n monitoring
k get nodes
helm list -n monitoring



<img width="950" height="990" alt="Screenshot 2025-08-10 230130" src="https://github.com/user-attachments/assets/a0cabfee-d9cd-4588-9259-08fa416744e9" />
<img width="942" height="986" alt="Screenshot 2025-08-10 225355" src="https://github.com/user-attachments/assets/55322bd6-9cec-4f59-83b8-6883c723a8d7" />
<img width="772" height="151" alt="Screenshot 2025-08-10 225428" src="https://github.com/user-attachments/assets/b341a694-cfa9-4764-9db8-ab2ec9652e3b" />
<img width="1491" height="91" alt="Screenshot 2025-08-10 225455" src="https://github.com/user-attachments/assets/878d6788-85d0-4f73-aaf4-5c9a36a8b7b7" />
<img width="1394" height="721" alt="Screenshot 2025-08-10 225944" src="https://github.com/user-attachments/assets/d0380d57-cea3-4a32-a396-a2f5b9075a67" />
