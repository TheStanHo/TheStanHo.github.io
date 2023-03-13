---
title: "Automate Terraform Infrastructure Deployments"
description: "Automate Terraform Infrastructure Deployments with Azure DevOps"
date: "2020-07-12"
banner:
  src: "../../images/andrea-de-santis-zwd435-ewb4-unsplash.jpg"
  alt: "IaC"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/zwd435-ewb4">Andrea De Santis</a></u>'
categories:
  - "Infrastructure as Code"
  - Terraform
  - Azure DevOps
keywords:
  - "Infrastructure as Code"
  - Azure DevOps
  - "Terraform"
  - "Blog"
---

## Introduction
With more and more businesses utilising Cloud platforms such as Azure, AWS or GCP and deploying their infrastructure to the cloud, it has become important to find ways to automate the deployment process of this. The benefits of automating deployment of IaC and IaC itself are:
* **Diaster recovery** - Having your infrastructure all coded out and automated allows you to redeploy your infrastructure in a few minutes. It also allows you to rollback changes to a working state if any new changes break your infrastructure.
* **Auditing** - Utilising IaC you can use branching policies and pull requests in your code repo to review any changes that are going to be made to the infrastructure (more on this later). Meaning you have an audit trail of the changes that have been made.
* **Security** - You can increase security by reducing permissions that people have in the Cloud Portal so that no deployments can be done via the portal and only via IaC.
* **Productivity/Efficiency** - By having your infrastructure as code you can deploy multiple environments e.g. for development, QA, production. This would take minutes, rather than hours when trying to deploy it via the portal. Saving time for engineers to spend time doing other tasks.
* **Documentation** - The IaC is your documentation for your infrastructure so if an engineer leaves, the infrastructure that is required is already documented and procedures to deploy and change it should be in place.

This blog will inform you how to deploy your Terraform scripts using Azure DevOps pipelines. Bearing in mind I have wrote this thinking you know about Terraform and have some understanding of Azure DevOps

## How to Automate deploying Infrastructure
By using the tool Terraform and CI/CD pipelines provided by Azure DevOps, we can build, change and version infrastructure both safely and efficiently. The first job is the map out your infrastructure and convert it into code by using Terraform. Terraform provides very good documentation on how to map out your resources into Terraform scripts, which can be found here. If you use certain cloud platforms here are some Terraform documentation below:
* [Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
* [AWS](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
* [Google Cloud Platform](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
Once you have your infrastructure beautifully coded into Terraform you can start configuring your pipelines. In Azure DevOps you should set up your pipelines

## Build Pipeline
The reason why we have a build pipeline is are for a number of reasons:
1. To check your code is valid before you can commit it to the master branch e.g. very useful once branch policies are set up for Pull requests
2. So that you can check the what changes will be made to the infrastructure if you deploy the Terraform scripts. As you can see from the example below one of the build steps is a "Terraform Plan" step which will show us the changes that will be made to the infrastructre, here it will create an Azure Kubernetes cluster. Terraform Plan is nicely formatted at the build pipeline with symbols with "+ = create", "- = destroy" and "~ = changes".
![Terraform Plan](../../images/AutomateTerraformInfrastructureDeployments/Terraform%20Plan%20Example.png)