

# 🗳️ Web Voting Application with K8S in GCP Kubeadm

### 🎯 Project Overview
This application is built using a mix of technologies. It's designed to be accessible to users via the internet, allowing them to vote for their preferred programming language out of six choices: C#, Python, JavaScript, Go, Java, and NodeJS.

## 🛠️ Technical Stack

- **Frontend**: The frontend of this application is built using React and JavaScript. It provides a responsive and user-friendly interface for casting votes.

- **Backend and API**: The backend of this application is powered by Go (Golang). It serves as the API handling user voting requests. MongoDB is used as the database backend, configured with a replica set for data redundancy and high availability.

## 🚀 Kubernetes Resources

To deploy and manage this application effectively, we leverage Kubernetes and a variety of its resources:

- 📂 1. **Namespaces**: It isolates resources within a Kubernetes cluster, providing logical separation between different environments or applications and helping manage resource quotas and access control efficiently.

- ⚙️ 2. **Deployments**

    - 🖥️ Backend Deployment: Deploys the backend application as a Kubernetes deployment with environment variables configured for MongoDB connectivity.

    - 🌐 Frontend Deployment: Deploys the frontend application, connecting it to the backend API.

    - 💾 MongoDB StatefulSet: Deploys a MongoDB database as a StatefulSet to ensure persistent storage and replication.

- 🔗 3. **Services**

    - 🔙 Backend Service: Exposes the backend using a ClusterIP service.

    - 🔜 Frontend Service: Exposes the frontend using a ClusterIP service.

    - 🛢️ MongoDB Service: Exposes MongoDB using a ClusterIP service with no external access.

- 🌍 4. **Ingress**: Configures NGINX Ingress to route traffic to the frontend service.

- 🔐 5. **ConfigMaps & Secrets**

    - ⚙️ MongoDB ConfigMap: Stores database connection strings.

    - 🔑 MongoDB Secrets: Stores database credentials securely.

- 💾 6. **Storage Class**: Used to dynamically provision persistent volumes for MongoDB, ensuring data persistence and scalability.

## Learning Opportunities

Creating and deploying this cloud-native web voting application with Kubernetes offers a valuable learning experience. Here are some key takeaways:

1. **Containerization**: Gain hands-on experience with containerization technologies like Docker for packaging applications and their dependencies.

2. **Kubernetes Orchestration**: Learn how to leverage Kubernetes to efficiently manage, deploy, and scale containerized applications in a production environment.

3. **Microservices Architecture**: Explore the benefits and challenges of a microservices architecture, where the frontend and backend are decoupled and independently scalable.

4. **Database Replication**: Understand how to set up and manage a MongoDB replica set for data redundancy and high availability.

5. **Security and Secrets Management**: Learn best practices for securing sensitive information using Kubernetes secrets.

6. **Stateful Applications**: Gain insights into the nuances of deploying stateful applications within a container orchestration environment.

7. **Persistent Storage**: Understand how Kubernetes manages and provisions persistent storage for applications with state.


## 📜 Deployment Instructions

**Clone the github repo**
```
git clone https://github.com/abhradippaul/K8S-Projects.git
cd voting-app/manifests
```

**Create CloudChamp Namespace**
```
kubectl create ns voting-app
```

**MONGO Database Setup**

To create Mongo statefulset with Persistent volumes, run the command in manifests folder:
```
kubectl apply -f mongo.yaml
```

Mongo Service
```
kubectl apply -f mongo-service.yaml
```

On the `mongo-0` pod, initialise the Mongo database Replica set. In the terminal run the following command:
```
kubectl exec -it -n voting-app mongodb-0 -- mongosh

rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-0.mongo-service.voting-app.svc:27017", priority: 2 },
    { _id: 1, host: "mongo-1.mongo-service.voting-app.svc:27017", priority: 1 },
    { _id: 2, host: "mongo-2.mongo-service.voting-app.svc:27017", priority: 1 }
  ]
})
```

Note: Wait until this command completes successfully, it typically takes 10-15 seconds to finish, and completes with the message: bye

You should see the following output:
```
test> rs.initiate({
...   _id: "rs0",
...   members: [
...     { _id: 0, host: "mongo-0.mongo-service.voting-app.svc:27017", priority: 2 },
...     { _id: 1, host: "mongo-1.mongo-service.voting-app.svc:27017", priority: 1 },
...     { _id: 2, host: "mongo-2.mongo-service.voting-app.svc:27017", priority: 1 }
...   ]
... })
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1718718451, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1718718451, i: 1 })
}
rs0 [direct: secondary] test>
```

To confirm run this in the terminal:
```
kubectl exec -it -n voting-app mongo-0 -- mongosh --eval "rs.status()" | grep "PRIMARY\|SECONDARY"
```
You should see the following output:
```
      stateStr: 'PRIMARY',
      stateStr: 'SECONDARY',
      stateStr: 'SECONDARY',
```

Load the Data in the database by running this command:
```
cat << EOF | kubectl exec -it -n voting-app mongo-0 -- mongosh
use langdb;
db.languages.insert({"name" : "csharp", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 5, "compiled" : false, "homepage" : "https://dotnet.microsoft.com/learn/csharp", "download" : "https://dotnet.microsoft.com/download/", "votes" : 0}});
db.languages.insert({"name" : "python", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 3, "script" : false, "homepage" : "https://www.python.org/", "download" : "https://www.python.org/downloads/", "votes" : 0}});
db.languages.insert({"name" : "javascript", "codedetail" : { "usecase" : "web, client-side", "rank" : 7, "script" : false, "homepage" : "https://en.wikipedia.org/wiki/JavaScript", "download" : "n/a", "votes" : 0}});
db.languages.insert({"name" : "go", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 12, "compiled" : true, "homepage" : "https://golang.org", "download" : "https://golang.org/dl/", "votes" : 0}});
db.languages.insert({"name" : "java", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 1, "compiled" : true, "homepage" : "https://www.java.com/en/", "download" : "https://www.java.com/en/download/", "votes" : 0}});
db.languages.insert({"name" : "nodejs", "codedetail" : { "usecase" : "system, web, server-side", "rank" : 20, "script" : false, "homepage" : "https://nodejs.org/en/", "download" : "https://nodejs.org/en/download/", "votes" : 0}});

db.languages.find().pretty();
EOF
```

Create Mongo secret:
```
kubectl apply -f mongo-secret.yaml
```

**API Setup**

Create GO API deployment by running the following command:
```
kubectl apply -f backend.yaml
```

Expose API deployment through service using the following command:
```
kubectl apply -f backend-service.yaml
```

Port forwarding of backend service
```
k port-forward -n voting-app svc/backend-service 8080:8080 --address=0.0.0.0 > /dev/null &
```

## Note: You can access the backend service http://<server-ip>:8080/ok
You should see this output:
![image](https://github.com/user-attachments/assets/9c591ae2-427d-4f62-b371-0a8721727785)


**Frontend setup**

Create the Frontend Deployment resource. In the terminal run the following command:
```
kubectl apply -f frontend.yaml
```
## Note: Edit the frontend.yaml and change the env value for "REACT_APP_APIHOSTPORT" to the backend-service URL "<server-ip>:8080"

Create a new Service resource of LoadBalancer type. In the terminal run the following command:
```
kubectl apply -f frontend-service.yaml
```



Test the full end-to-end cloud native application

 Using your local workstation's browser - browse to the URL created in the previous output.

After the voting application has loaded successfully, vote by clicking on several of the **+1** buttons, this will generate AJAX traffic which will be sent back to the API via the API's assigned ELB.


Query the MongoDB database directly to observe the updated vote data. In the terminal execute the following command:
```
kubectl exec -it -n voting-app mongo-0 -- mongosh langdb --eval "db.languages.find().pretty()"
```

## **Summary**

In this Project, you learnt how to deploy a cloud native application into EKS. Once deployed and up and running, you used your local workstation's browser to test out the application. You later confirmed that your activity within the application generated data which was captured and recorded successfully within the MongoDB ReplicaSet back end within the cluster.
