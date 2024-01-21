---
title: "Provisioning Grafana (v10.2)"
description: "Grafana Provisioning via helmcharts"
date: "2024-01-20"
banner:
  src: "../../images/GrafanaProvisioning/stephen-dawson-qwtCeJ5cLYs-unsplash.jpg"
  alt: "Metrics"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/turned-on-monitoring-screen-qwtCeJ5cLYs">Stephen Dawson</a></u>'
categories:
  - "Monitoring"
  - "AKS"
  - "Kubernetes"
keywords:
  - "Monitoring"
  - "Grafana"
  - "Kubernetes"
  - "AKS"
  - "Provisioning"
  - "Blog"
---

## Introduction
Having spent time in my DevOps career using Grafana and maintaining it. I've never actually had the chance to deploy it from scratch, especially the newer version. Since the versions that I have used have all been < v9.0. I can presume that the current latest version of v10.2 probably has a lot of new features and changes.

This blog is written on how I deployed Grafana and provisoned the Dashboard, Alerts, Datasources, Contact points (Since they had broken down Notifcations channels into Notification Policies and Contact Points) and Notification Policies. Luckily enough, I set up a sandbox environment as mentioned in an [early blog](https://thestanho.github.io/SettingUpAPersonalSandbox/) which I will be using to deploy Grafana too. This is far better than Minikube in my opinion as personally it tends not to work that well for me, or I'm just not well versed in the workings of it.

- The helmchart used can be found here on [ArtifactHub](https://artifacthub.io/packages/helm/grafana/grafana) or via the source on [Github](https://github.com/grafana/helm-charts/tree/main/charts/grafana)
- The Azure DevOps Yaml pipeline I used to deploy can be found below.
```yaml
trigger:
  - false
resources:
  - repo: self
pool:
  vmImage: windows-latest
variables:
  - name: serviceConnectionName
    value: "<updateMe!>"
  - name: resourceGroupName
    value: "<updateMe!>"
  - name: AKSClusterName
    value: "<updateMe!>"
stages:
  - stage: Helm
    displayName: Helm
    jobs:
    - job: Helm
      displayName: "Helm"
      steps:
        - task: HelmInstaller@0
          displayName: 'Install Helm 2.14.1'
        - task: HelmDeploy@0
          displayName: 'helm upgrade'
          inputs:
            azureSubscription: $(serviceConnectionName)
            azureResourceGroup: '$(resourceGroupName)'
            kubernetesCluster: '$(AKSClusterName)'
            namespace: default
            command: upgrade
            chartType: FilePath
            chartPath: 'grafana'
            releaseName: 'grafana'
            arguments: '--install'
```
## Provisioning Set up - Helmchart
To enable provisioning of the dashboards, alerts, datasources etc. We need to enable the sidecars that will help pick up the configmaps/secrets used to deploy these resources. To do this in the Grafana values.yaml enable and set the following values. 

```yaml
sidecar:
  alerts:
    enabled: true
    # label that the configmaps with alert are marked with
    label: grafana_alert
    # value of label that the configmaps with alert are set to
    labelValue: "provision"
    # If specified, the sidecar will search for alert config-maps inside this namespace.
    # Otherwise the namespace in which the sidecar is running will be used.
    # It's also possible to specify ALL to search in all namespaces
    searchNamespace: null
    # Method to use to detect ConfigMap changes. With WATCH the sidecar will do a WATCH requests, with SLEEP it will list all ConfigMaps, then sleep for 60 seconds.
    watchMethod: WATCH
    # search in configmap, secret or both
    resource: both
  dashboards:
    enabled: true
    # label that the configmaps with dashboards are marked with
    label: grafana_dashboard
    # value of label that the configmaps with dashboards are set to
    labelValue: "provision"
    # If specified, the sidecar will search for alert config-maps inside this namespace.
    # Otherwise the namespace in which the sidecar is running will be used.
    # It's also possible to specify ALL to search in all namespaces
    searchNamespace: null
    # Method to use to detect ConfigMap changes. With WATCH the sidecar will do a WATCH requests, with SLEEP it will list all ConfigMaps, then sleep for 60 seconds.
    watchMethod: WATCH
    # search in configmap, secret or both
    resource: both
    # If specified, the sidecar will look for annotation with this name to create folder and put graph here.
    # You can use this parameter together with `provider.foldersFromFilesStructure`to annotate configmaps and create folder structure.
    folderAnnotation: grafana_dashboard_folder
    provider:
      # disableDelete to activate a import-only behaviour
      disableDelete: true
      # allow updating provisioned dashboards from the UI
      allowUiUpdates: false
      # allow Grafana to replicate dashboard structure from filesystem
      foldersFromFilesStructure: true
  datasources:
    enabled: true
    label: grafana_datasource
    # value of label that the configmaps with datasources are set to
    labelValue: "provision"
    # Log level. Can be one of: DEBUG, INFO, WARN, ERROR, CRITICAL.
    # logLevel: INFO
    # If specified, the sidecar will search for datasource config-maps inside this namespace.
    # Otherwise the namespace in which the sidecar is running will be used.
    # It's also possible to specify ALL to search in all namespaces
    searchNamespace: null
    # Method to use to detect ConfigMap changes. With WATCH the sidecar will do a WATCH requests, with SLEEP it will list all ConfigMaps, then sleep for 60 seconds.
    watchMethod: WATCH
    # search in configmap, secret or both
    resource: both
```
**Note**: I don't install the plugin's via this method since as it staes in their documentation (yes sometimes I actually read it) [here](https://grafana.com/docs/grafana/latest/administration/provisioning/#plugins), that the feature enables the provisioning of plugin configuration but not of the plugins themselves, so it is just easier to set the required plugins in the values.yaml. 

So above is just the main configuration that I set in the values.yaml for the Grafana helmchart to allow me to provsion via configmaps and secrets. Things I've learned when trying to do so:
1. Remember to set the labelValue, this is important for the sidecar to pick up the configmap or secret. I believe in the values.yaml they left it as "" blank so you have to set is value and match it with the label value you set for your configmap/secret.
2. I found it useful to just manually create the bits I required in Grafana and then exported the yaml of it to help set the yaml that I required. 

## Provisoning the Grafana resources 

### Dashboard
One thing to remember for this is that if you want to put your dashboard in a specific folder then add the annotation *"grafana_dashboard_folder"* and make sure that in the values.yaml file, that your *"folderAnnotation"* value is set

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: dashboard-one
  labels:
     grafana_dashboard: "provision"
  annotations: 
    grafana_dashboard_folder: "Dashboard one"
data:
  dashboard-one.json: |-
    <Dashboard.json file contents here>
```

### Datasource
To test this I actually deployed a [Prometheus](https://github.com/prometheus-community/helm-charts) instance on my AKS, so that I have a working datasource I could actually add to it.

[Documentation about datasources](https://grafana.com/docs/grafana/latest/datasources/). Helpful documentation with core datasources and also links to how to provsion them.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: datasources
  labels:
    grafana_datasource: 'provision' 
stringData:
  datasources.yaml: |-
    apiVersion: 1
    datasources:
      - name: Prometheus-Production
        type: prometheus
        # Access mode - proxy (server in the UI) or direct (browser in the UI).
        url: http://10.244.0.38:9090
        jsonData:
          httpMethod: POST
          manageAlerts: true
          prometheusType: Prometheus
          #prometheusVersion: 2.44.0
          cacheLevel: 'low'
          disableRecordingRules: false
          incrementalQueryOverlapWindow: 10m
      - name: Prometheus-Test
        type: prometheus
        # Access mode - proxy (server in the UI) or direct (browser in the UI).
        url: http://10.244.0.38:9090
        jsonData:
          httpMethod: POST
          manageAlerts: true
          prometheusType: Prometheus
          #prometheusVersion: 2.44.0
          cacheLevel: 'low'
          disableRecordingRules: false
          incrementalQueryOverlapWindow: 10m
```

### Alerts
**Note:** Make sure to label your alert when creating it! To be used in the notification policies!
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-alert
  labels:
     grafana_alert: "provision"
data:
  alerts.yaml: |-
        apiVersion: 1
        groups:
            - orgId: 1
            name: Alerts-Test
            folder: Alerting Dashboards
            interval: 5m
            rules:
                - uid: <UID>
                title: Alert-Demo
                condition: C
                data:
                    - refId: A
                    relativeTimeRange:
                        from: 600
                        to: 0
                    datasourceUid: <datasourceUID>
                    model:
                        disableTextWrap: false
                        editorMode: builder
                        expr: aggregator_discovery_aggregation_count_total{agentpool="default"}
                        fullMetaSearch: false
                        includeNullMetadata: true
                        instant: true
                        intervalMs: 1000
                        legendFormat: __auto
                        maxDataPoints: 43200
                        range: false
                        refId: A
                        useBackend: false
                    - refId: B
                    relativeTimeRange:
                        from: 600
                        to: 0
                    datasourceUid: __expr__
                    model:
                        conditions:
                            - evaluator:
                                params: []
                                type: gt
                            operator:
                                type: and
                            query:
                                params:
                                    - B
                            reducer:
                                params: []
                                type: last
                            type: query
                        datasource:
                            type: __expr__
                            uid: __expr__
                        expression: A
                        intervalMs: 1000
                        maxDataPoints: 43200
                        reducer: last
                        refId: B
                        type: reduce
                    - refId: C
                    relativeTimeRange:
                        from: 600
                        to: 0
                    datasourceUid: __expr__
                    model:
                        conditions:
                            - evaluator:
                                params:
                                    - 0
                                type: gt
                            operator:
                                type: and
                            query:
                                params:
                                    - C
                            reducer:
                                params: []
                                type: last
                            type: query
                        datasource:
                            type: __expr__
                            uid: __expr__
                        expression: B
                        intervalMs: 1000
                        maxDataPoints: 43200
                        refId: C
                        type: threshold
                noDataState: NoData
                execErrState: Error
                for: 5m
                annotations:
                    description: ""
                    runbook_url: ""
                    summary: ""
                labels:
                    "": ""
                    team: Marvel
                isPaused: false
```

### Contact Points
Contact points is basically your notification channels, from legacy Grafana. Since Notifications channels were split into Contact Points and Notification Policy. 
[Documentation on contact points](https://grafana.com/docs/grafana/latest/alerting/fundamentals/contact-points/#contact-points).
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: contact-point
  labels:
    grafana_alert: "provision" 
stringData:
  contact-points.yaml: |-
    apiVersion: 1
    contactPoints:
        - orgId: 1
          name: Team-Marvel
          receivers:
            - uid: Team-Marvel
              type: email
              settings:
                addresses: Team-Marvel@hotmail.co.uk
                singleEmail: true
              disableResolveMessage: false
        - orgId: 1
          name: Team-DC
          receivers:
            - uid: Team-DC
              type: email
              settings:
                addresses: Team-DC@hotmail.co.uk
                singleEmail: true
              disableResolveMessage: false
```

### Notification Policies
You see here for notification policies I have *"object_matchers"* which will link the notification policy to the alert that was created. Hence, why it is important to label you alerts, so you can help define which notification policy route it is routed to and to which contact point.
[Documentation on Notification Policies](https://grafana.com/docs/grafana/latest/alerting/fundamentals/notification-policies/#notification-policies).
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: notification-policies
  labels:
    grafana_alert: "provision" 
data:
  notification-policies.yaml: |-
    apiVersion: 1
    policies:
      - orgId: 1
        receiver: grafana-default-email
        group_by: ['...']
        routes:
          - receiver: Team-Marvel
            object_matchers:
              - ['team', '=', 'Marvel']
          - receiver: Team-DC
            object_matchers:
              - ['team', '=', 'DC']
```

## Conclusion 
Personally, I've learned quite alot trying to implement this in my sandbox. I've learned how the new Grafana version works especially with the new way that alerting is implemented with the newer version of Grafana. I've also noticed it will be such a pain to migrate old dashboards on older versions of Grafana to newer Versions of Grafana. (Although, hopefully there is some documentation I missed talking about such a migration!). 

Also, with this kind of provisioning of such dashboards and alerts via configmaps it could allow development teams to provsion their own dashboards as part of their Helm releases so that as well as deploying their app they have a way of monitoring and alerting set up also for their applications.
