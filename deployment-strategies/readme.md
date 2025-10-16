# Deployment strategies in Kubernetes

Strategy ->
Recreate (Pod delete then recreate, Downtime YES, Production NO),
Rolling Update (First create then terminate, Downtime ALMOST NO, Production ALMOST YES),
Blue Green (Create a copy of the env, Downtime NO, Production YES),
Canary (Distribute load between the previous version and current version, Downtime NO, Production YES),
Progressive Delivery (ArgoCD Rollouts same as canary, Downtime NO, Production YES),
A/B Testing (Same as Blue Green, Downtime ALMOST NO, Production NO),
Shadown (Same as Blue Green, Downtime YES, Production NO),

Image -> abhradippaul/deployment-strategies:v1, abhradippaul/deployment-strategies:v2

## Project Overview

<img width="1584" height="943" alt="diagram-export-10-15-2025-1_56_11-AM" src="https://github.com/user-attachments/assets/709f7e6c-2fb0-4eb2-b1fa-4f3588c4c810" />

## Prerequisite:

### Clone the GitHub project and go to the deployment-strategies folder

```
git clone https://github.com/abhradippaul/K8S-Projects.git
cd deployment-strategies
```

### Ingress setup

To set up the ingress, we first have to configure the NGINX Ingress controller.

Nginx Ingress Controller:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

Verify Ingress Controller Installation:

```
kubectl get all -n ingress-nginx

NAME                                            READY   STATUS      RESTARTS   AGE
pod/ingress-nginx-admission-create-7f8jj        0/1     Completed   0          25d
pod/ingress-nginx-admission-patch-7np8x         0/1     Completed   0          25d
pod/ingress-nginx-controller-64c9777558-j95sv   0/1     Running     0          14s

NAME                                         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
service/ingress-nginx-controller             LoadBalancer   10.99.149.157   <pending>     80:31610/TCP,443:32254/TCP   25d
service/ingress-nginx-controller-admission   ClusterIP      10.103.5.11     <none>        443/TCP                      25d

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/ingress-nginx-controller   0/1     1            0           25d

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/ingress-nginx-controller-64c9777558   1         1         0       15s
replicaset.apps/ingress-nginx-controller-b865cf559    0         0         0       25d

NAME                                       COMPLETIONS   DURATION   AGE
job.batch/ingress-nginx-admission-create   1/1           8s         25d
job.batch/ingress-nginx-admission-patch    1/1           8s         25d
```

We have to change the service type for "ingress-nginx-controller" in "ingress-nginx" "LoadBalancer" to "NodePort" because this is a kubeadm-based setup loadbalancer service will not automatically work.

Change the service type. In the terminal, run the following command, and in the manifest search for "type: LoadBalancer" and change to "type: NodePort":

```
kubectl edit svc -n ingress-nginx ingress-nginx-controller
```

Verify the service:

```
kubectl get svc -n ingress-nginx
```

You should see this output:

```
NAME                                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.99.149.157   <none>        80:31610/TCP,443:32254/TCP   25d
ingress-nginx-controller-admission   ClusterIP   10.103.5.11     <none>        443/TCP                      25d
```

Ingress controller setup is completed.

## Gateway API Setup

```
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.4.0/standard-install.yaml
```

## Install NGINX Gateway Fabric Setup

```
kubectl apply --server-side -f https://raw.githubusercontent.com/nginx/nginx-gateway-fabric/v2.1.4/deploy/crds.yaml

kubectl apply -f https://raw.githubusercontent.com/nginx/nginx-gateway-fabric/v2.1.4/deploy/nodeport/deploy.yaml
```

Verify installation:

```
kubectl get all -n nginx-gateway
kubectl get gatewayclass
```

```
NAME                                       READY   STATUS    RESTARTS   AGE
pod/nginx-gateway-86c78fbbcf-g6wd6         1/1     Running   0          4m35s
pod/nginx-gateway-nginx-5c57ff7c5f-lvpww   1/1     Running   0          3m57s

NAME                          TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/nginx-gateway         ClusterIP   10.105.29.36    <none>        443/TCP          4m35s
service/nginx-gateway-nginx   NodePort    10.105.181.26   <none>        3000:31422/TCP   3m57s

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-gateway         1/1     1            1           4m35s
deployment.apps/nginx-gateway-nginx   1/1     1            1           3m57s

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-gateway-86c78fbbcf         1         1         1       4m35s
replicaset.apps/nginx-gateway-nginx-5c57ff7c5f   1         1         1       3m57s

NAME    CONTROLLER                                   ACCEPTED   AGE
nginx   gateway.nginx.org/nginx-gateway-controller   True       3m46s
```

## Recreate Deployment Strategy

### Goto the recreate folder

```
cd recreate
kubectl create ns recreate-ns
kubectl apply -f .
```

### Change the image of the deployment to initilize deployment strategy:

```
kubectl set image -n recreate-ns deployment/recreate-deployment recreate-container=abhradippaul/deployment-strategies:v2
```

### Output

All previous pods will be deleted first, then the new pod will be created using this recreate strategy. This involves downtime.

```
kubectl get all -n recreate-ns

NAME                                       READY   STATUS    RESTARTS   AGE
pod/recreate-deployment-848865467d-9w6dj   1/1     Running   0          36s
pod/recreate-deployment-848865467d-rlrzb   1/1     Running   0          36s
pod/recreate-deployment-848865467d-ts9c7   1/1     Running   0          36s
pod/recreate-deployment-848865467d-tzv2t   1/1     Running   0          36s
pod/recreate-deployment-848865467d-znrq6   1/1     Running   0          36s

NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
service/recreate-svc   ClusterIP   10.101.166.113   <none>        80/TCP    36s

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/recreate-deployment   5/5     5            5           36s

kubectl get ingress -n recreate-ns

NAME                             CLASS   HOSTS   ADDRESS          PORTS   AGE
recreate-deployment-strategies   nginx   *       10.110.215.177   80      71s
```

### Access the website

```
kubectl get svc -n ingress-nginx

NAME                                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.100.217.244   <none>        80:31486/TCP,443:31907/TCP   139m
ingress-nginx-controller-admission   ClusterIP   10.102.33.172    <none>        443/TCP
```

Open browser and type http://NODE-IP:31486

## Rolling Update Deployment Strategy

### Goto the rolling-update folder

```
cd rolling-update
kubectl create ns rollingupdate-ns
kubectl apply -f .
```

### Change the image of the deployment to initilize deployment strategy:

```
kubectl set image -n rollingupdate-ns deployment/rollingupdate-deployment rollingupdate-container=abhradippaul/deployment-strategies:v2
```

### Output

Using this rolling update strategy, only one pod will be recreated in advance, and then the previous pod will be terminated to avoid downtime.

```
kubectl get all -n rollingupdate-ns

NAME                                            READY   STATUS    RESTARTS   AGE
pod/rollingupdate-deployment-6fb9dbc6d6-bcwnl   1/1     Running   0          98s
pod/rollingupdate-deployment-6fb9dbc6d6-jd779   1/1     Running   0          98s
pod/rollingupdate-deployment-6fb9dbc6d6-ncpqj   1/1     Running   0          98s
pod/rollingupdate-deployment-6fb9dbc6d6-stnxn   1/1     Running   0          98s
pod/rollingupdate-deployment-6fb9dbc6d6-v8tp5   1/1     Running   0          98s

NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/rollingupdate-svc   ClusterIP   10.111.250.45   <none>        80/TCP    98s

NAME                                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/rollingupdate-deployment   5/5     5            5           98s

NAME                                                  DESIRED   CURRENT   READY   AGE
replicaset.apps/rollingupdate-deployment-6fb9dbc6d6   5         5         5       98s

kubectl get ingress -n rollingupdate-ns

NAME                                  CLASS   HOSTS   ADDRESS          PORTS   AGE
rollingupdate-deployment-strategies   nginx   *       10.110.215.177   80      2m36s
```

### Access the website

```
kubectl get svc -n ingress-nginx

NAME                                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.100.217.244   <none>        80:31486/TCP,443:31907/TCP   139m
ingress-nginx-controller-admission   ClusterIP   10.102.33.172    <none>        443/TCP
```

Open browser and type http://NODE-IP:31486

## Blue Green Deployment Strategy

### Goto the rolling-update folder

```
cd blue-green
kubectl create ns bluegreen-ns
kubectl apply -f .
```

### Output

Using this blue green deployment strategies we can distribute traffic using gateway api between old deployment and new deployment as needed.

```
kubectl get all -n nginx-gateway
NAME                                       READY   STATUS    RESTARTS   AGE
pod/nginx-gateway-86c78fbbcf-v2zwj         1/1     Running   0          47m
pod/nginx-gateway-nginx-6ccb875455-bs5z7   1/1     Running   0          2m19s

NAME                          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
service/nginx-gateway         ClusterIP   10.108.105.207   <none>        443/TCP        47m
service/nginx-gateway-nginx   NodePort    10.105.163.211   <none>        80:31804/TCP   2m20s

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-gateway         1/1     1            1           47m
deployment.apps/nginx-gateway-nginx   1/1     1            1           2m20s

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-gateway-86c78fbbcf         1         1         1       47m
replicaset.apps/nginx-gateway-nginx-6ccb875455   1         1         1       2m20s

kubectl get httproute -n bluegreen-ns

NAME                  HOSTNAMES   AGE
bluegreen-httproute               75s
```

### Access the website

```
kubectl get svc -n nginx-gateway

NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
nginx-gateway         ClusterIP   10.105.29.36    <none>        443/TCP          5m56s
nginx-gateway-nginx   NodePort    10.105.181.26   <none>        3000:31422/TCP   5m18s
```

Open browser and type http://NODE-IP:31422

## Canary Deployment Strategy

### Goto the canary folder

```
cd canary
kubectl create ns canary-ns
kubectl apply -f .
```

### Output

Using this canary deployment strategies we can distribute traffic between old deployment and new deployment using deployment replicas.

```
kubectl get all -n canary-ns

NAME                                        READY   STATUS    RESTARTS   AGE
pod/canary-v1-deployment-7589cf6bf5-qzz67   1/1     Running   0          14s
pod/canary-v1-deployment-7589cf6bf5-w9f7p   1/1     Running   0          14s
pod/canary-v2-deployment-7784b7b689-6dlqx   1/1     Running   0          14s
pod/canary-v2-deployment-7784b7b689-vhdzg   1/1     Running   0          14s

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/canary-svc   ClusterIP   10.107.41.169   <none>        80/TCP    14s

NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/canary-v1-deployment   2/2     2            2           14s
deployment.apps/canary-v2-deployment   2/2     2            2           14s

NAME                                              DESIRED   CURRENT   READY   AGE
replicaset.apps/canary-v1-deployment-7589cf6bf5   2         2         2       14s
replicaset.apps/canary-v2-deployment-7784b7b689   2         2         2       14s

kubectl get ingress -n canary-ns

NAME                           CLASS   HOSTS   ADDRESS         PORTS   AGE
canary-deployment-strategies   nginx   *       10.102.36.101   80      2m48s
```

### Access the website

```
kubectl get svc -n ingress-nginx

NAME                                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.100.217.244   <none>        80:31486/TCP,443:31907/TCP   139m
ingress-nginx-controller-admission   ClusterIP   10.102.33.172    <none>        443/TCP
```

Open browser and type http://NODE-IP:31486
