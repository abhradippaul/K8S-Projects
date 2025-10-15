# Deployment strategies in Kubernetes

Strategy ->
Recreate (Pod delete then recreate, Downtime YES, Production NO),
Rolling Update (First create then terminate, Downtime ALMOST NO, Production ALMOST YES),
Blue Green (Create a copy of the env, Downtime NO, Production YES),
Canary (Distribute load between the previous version and current version, Downtime NO, Production YES),
Progressive Delivery (ArgoCD Rollouts same as canary, Downtime NO, Production YES),
A/B Testing (Same as Blue Green, Downtime ALMOST NO, Production NO),
Shadown (Same as Blue Green, Downtime YES, Production NO),

Image -> amitabhdevops/online_shop, amitabhdevops/online_shop_without_footer

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
```

You should see output like this:

```
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

For checking the downtime we will create a pod as request client and see the log.

Create request client pod:

```
k apply -f client.yaml
```

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
kubectl get pods -n nginx-gateway
kubectl get gatewayclass
```

```
NAME                             READY   STATUS    RESTARTS        AGE
nginx-gateway-86c78fbbcf-xkzp8   1/1     Running   2 (3m43s ago)   3m46s

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
kubectl set image -n recreate-ns deployment/online-shop-deploy online-shop-container=amitabhdevops/online_shop_without_footer
```

### Output

All previous pods will be deleted first, then the new pod will be created using this recreate strategy. This involves downtime.

```
NAME                                  READY   STATUS              RESTARTS   AGE
online-shop-deploy-556d9f8cd4-2fwtd   0/1     ContainerCreating   0          2s
online-shop-deploy-556d9f8cd4-5stxz   0/1     ContainerCreating   0          2s
online-shop-deploy-556d9f8cd4-797pp   0/1     ContainerCreating   0          2s
online-shop-deploy-556d9f8cd4-ghqhn   0/1     ContainerCreating   0          2s
online-shop-deploy-556d9f8cd4-q2qk2   0/1     ContainerCreating   0          2s
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
kubectl set image -n rollingupdate-ns deployment/online-shop-deploy online-shop-container=amitabhdevops/online_shop_without_footer
```

### Output

Using this rolling update strategy, only one pod will be recreated in advance, and then the previous pod will be terminated to avoid downtime.

```
NAME                                  READY   STATUS              RESTARTS   AGE
online-shop-deploy-556d9f8cd4-bcw2g   0/1     ContainerCreating   0          1s
online-shop-deploy-556d9f8cd4-cls65   1/1     Running             0          15s
online-shop-deploy-556d9f8cd4-vkmvw   1/1     Running             0          4s
online-shop-deploy-556d9f8cd4-x2r4z   1/1     Running             0          18s
online-shop-deploy-566ccbc757-jvxjq   1/1     Running             0          64s
online-shop-deploy-566ccbc757-k796t   1/1     Running             0          64s
online-shop-deploy-566ccbc757-xt9tt   1/1     Terminating         0          64s

NAME                                  READY   STATUS              RESTARTS   AGE
online-shop-deploy-556d9f8cd4-6z2dk   0/1     ContainerCreating   0          1s
online-shop-deploy-556d9f8cd4-bcw2g   1/1     Running             0          4s
online-shop-deploy-556d9f8cd4-cls65   1/1     Running             0          18s
online-shop-deploy-556d9f8cd4-vkmvw   1/1     Running             0          7s
online-shop-deploy-556d9f8cd4-x2r4z   1/1     Running             0          21s
online-shop-deploy-566ccbc757-jvxjq   1/1     Running             0          67s
online-shop-deploy-566ccbc757-k796t   0/1     Completed           0          67s
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

```

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
NAME                                    READY   STATUS    RESTARTS   AGE
online-shop-v1-deploy-cb6db7766-28lfj   1/1     Running   0          29m
online-shop-v1-deploy-cb6db7766-mqtk9   1/1     Running   0          29m
online-shop-v2-deploy-5988f986d-9svn4   1/1     Running   0          26m
online-shop-v2-deploy-5988f986d-bhq6g   1/1     Running   0          2m46s
online-shop-v2-deploy-5988f986d-bwxgj   1/1     Running   0          29m
online-shop-v2-deploy-5988f986d-jcrtw   1/1     Running   0          2m46s
```

### Access the website

```
kubectl get svc -n ingress-nginx

NAME                                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx-controller             NodePort    10.100.217.244   <none>        80:31486/TCP,443:31907/TCP   139m
ingress-nginx-controller-admission   ClusterIP   10.102.33.172    <none>        443/TCP
```

Open browser and type http://NODE-IP:31486
