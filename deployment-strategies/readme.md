Deployment strategies in Kubernetes

Strategy ->
Recreate (Pod delete then recreate, Downtime YES, Production NO),
Rolling Update (First create then terminate, Downtime ALMOST NO, Production ALMOST YES),
Blue Green (Create copy of the env, Downtime NO, Production YES),
Canary (Distribute load between prev version and current version, Downtime NO, Production YES),
Progressive Delivery (ArgoCD Rollouts same as canary, Downtime NO, Production YES),
A/B Testing (Same as Blue Green, Downtime ALMOST NO, Production NO),
Shadown (Same as Blue Green, Downtime YES, Production NO),
