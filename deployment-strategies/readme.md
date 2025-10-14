# Deployment strategies in Kubernetes

Strategy ->
Recreate (Pod delete then recreate, Downtime YES, Production NO),
Rolling Update (First create then terminate, Downtime ALMOST NO, Production ALMOST YES),
Blue Green (Create copy of the env, Downtime NO, Production YES),
Canary (Distribute load between prev version and current version, Downtime NO, Production YES),
Progressive Delivery (ArgoCD Rollouts same as canary, Downtime NO, Production YES),
A/B Testing (Same as Blue Green, Downtime ALMOST NO, Production NO),
Shadown (Same as Blue Green, Downtime YES, Production NO),

Image -> amitabhdevops/online_shop, amitabhdevops/online_shop_without_footer

## Prerequisite:

### Clone the github project and go to the deployment-strategies folder

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

## Recreate Strategy

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
