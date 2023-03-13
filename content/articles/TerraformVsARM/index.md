---
title: "Terraform Vs ARM"
description: "Terraform Vs ARM"
date: "2020-06-12"
banner:
  src: "../../images/nathan-waters-j7q-Z9DV3zw-unsplash.jpg"
  alt: "IaC"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/j7q-Z9DV3zw">Nathan Waters</a></u>'
categories:
  - "Infrastructure as Code"
  - Terraform
keywords:
  - "Infrastructure as Code"
  - "Azure"
  - "ARM"
  - "Terraform"
  - "Blog"
---
The following is a quick blog of my opinion on Terraform and Azure ARM. I am by far an expert on these tools, having only used Terraform on and off for 2 months and Azure ARM for less than a month. Both have its benefits which I will go on to explain and will reveal my preferred choice and why at the end. I have to also mention that I use Azure as my cloud provider so this will be written from that perspective. So lets begin and compare some points I feel are important for a good tool to use for Infrastructure as code (IaC)

## Understanding
The way that Terraform is written allows for a wider audience to use of all skill levels. The simplicity of the documentation and examples given from it, allow for the user to easily apply Terraform to their own needs. For example the below code allows me to create a Windows Virtual Machine (VM), allocate it's network card, login information, the spec of the virtual machine, data disks and operating disks. It can also do more such as running certain scripts after the VM has been built

```json
            resource "azurerm_virtual_machine" "main" {
              name                  = "${var.prefix}-vm"
              location              = "${azurerm_resource_group.main.location}"
              resource_group_name   = "${azurerm_resource_group.main.name}"
              network_interface_ids = ["${azurerm_network_interface.main.id}"]
              vm_size               = "Standard_DS1_v2"
            
              storage_image_reference {
                publisher = "MicrosoftWindowsServer"
                offer     = "WindowsServer"
                sku       = "2016-Datacenter"
                version   = "latest"
              }
              storage_os_disk {
                name              = "myosdisk1"
                caching           = "ReadWrite"
                create_option     = "FromImage"
                managed_disk_type = "Standard_LRS"
              }
              os_profile {
                computer_name  = "hostname"
                admin_username = "testadmin"
                admin_password = "Password1234!"
              }
              os_profile_linux_config {
                disable_password_authentication = false
              }
              tags = {
                environment = "staging"
              }
            }
          
```
As previously mentioned the documentation as for any technology is key to how well the user will understand how to use it. And for Terraform it is excellent (VM documentation here). Terraform uses it's own HCL language the interpolation syntax it utilises is very powerful, and lets you reference variables and attributes with ease. In addition, because it utilises this HCL language it also makes it more readable and user friendly in my opinion than Azure ARM. Azure ARM is written in JSON which, yes it could be argued is also readable but when you see it and try to utilise it for the first time it can be quite interesting to say the least. An example defining a virtual machine resource is below.

```json
    {
                  "type": "Microsoft.Compute/virtualMachines",
                  "apiVersion": "2018-10-01",
                  "name": "[variables('vmName')]",
                  "location": "[parameters('location')]",
                  "dependsOn": [
                    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
                    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
                  ],
                  "properties": {
                    "hardwareProfile": {
                      "vmSize": "[parameters('vmSize')]"
                    },
                    "osProfile": {
                      "computerName": "[variables('vmName')]",
                      "adminUsername": "[parameters('adminUsername')]",
                      "adminPassword": "[parameters('adminPassword')]"
                    },
                    "storageProfile": {
                      "imageReference": {
                        "publisher": "MicrosoftWindowsServer",
                        "offer": "WindowsServer",
                        "sku": "[parameters('windowsOSVersion')]",
                        "version": "latest"
                      },
                      "osDisk": {
                        "createOption": "FromImage"
                      },
                      "dataDisks": [
                        {
                          "diskSizeGB": 1023,
                          "lun": 0,
                          "createOption": "Empty"
                        }
                      ]
                    },
                    "networkProfile": {
                      "networkInterfaces": [
                        {
                          "id": "[resourceId('Microsoft.Network/networkInterfaces',variables('nicName'))]"
                        }
                      ]
                    },
                    "diagnosticsProfile": {
                      "bootDiagnostics": {
                        "enabled": true,
                        "storageUri": "[reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))).primaryEndpoints.blob]"
                      }
                    }
                  }
                }
              ]
```
Looking at both the Terraform and Azure ARM way of defining a VM, I know which one I prefer myself. *Cough* Terraform *Cough*

## Cross-platform
As Terraform is not platform specific unlike Azure ARM, it is versatile allowing you to write your infrastructure as code (IaC) for different cloud providers such as Google Cloud Platform (GCP), Amazon Web Services (AWS) or VMware just to name a few. This is useful for businesses that utilise more than one Cloud platform to provide their services, which according to a report is the case ["UK businesses turn to multiple cloud providers"](https://www.uktech.news/news/uk-businesses-turn-multiple-cloud-providers-20190103) Don't really think I need to write something for Azure ARM for this.

## Community and support
I found that Terraform responds to issues that are reported quite quickly and the support by the community is also a speedy response. [Click here for issue forum](https://github.com/terraform-providers). I personally haven't used the support for Azure ARM, but this is due to the nice error responses that get thrown up when you do try deploy it. Not to say that Terraform doesn't do the same.

## Easy of deployment/Workflow
Talking in terms of using Azure DevOps to deploy. Both I found are quite simple to deploy, although I found that Azure ARM templates are easier to deploy, due to it being deployed on its native platform. Terraform I had to find out how to write the .yaml instruction document to deploy. Azure ARM templates however, do require you to create the resources groups that you are deploying too and for each resource group you'll need a ARM template for. Unlike in Terraform where it would deploy the resource groups itself as defined in the .tf files, you could technically deploy all the resource groups you need and define it in a single .tf file. For tools I always use Visual Studio code, both Terraform and Azure ARM both have extensions installed on it allowing for syntax highlighting and suggestions. Both do a great job.

* [Terraform Visual Studio Code extension](https://github.com/Azure/vscode-azureterraform)
* [Azure ARM Visual Studio Code extension](https://github.com/Microsoft/vscode-azurearmtools)

## Validation
Where both do validate the code for you before you apply the code itself. Although Azure ARM does not validate the deployment and you will have to deploy it to see whether everything is working as planned. Terraform on the other hand, does validate it through it's plan phase, where it checks the status of whats currently deployed in the Terraform state file (Stored as a blob on Azure if deploying to Azure)

## Maintainability
Having used Terraform more and having to maintain its files more I can say that Terraform will seem to me to be easier. As I haven't had to do "big" maintenance on Azure ARM yet. But looking at it compared to Terraform I am not looking forward to it at all! This is due to the fact that Terraform is more readable than ARM and has better syntax for defining and calling variables/attributes.

## Resource Support
What I mean by this is whether the tools support the resources that you need to deploy, such as VMs, databases etc. As Terraform is quite a new tool compared to Azure ARM and given that Azure ARM is written by the Cloud provider I use it is bound to be quite up to date with the that can be deployed via IaC. I found that Terraform lacks quite a few new resources, which is not a surprise seeing as it's just nearly on version 2.0. I also found from personal experience that even if it has the resources on there, some attributes that you want to define for that resource is not allowed or given. They have given an alternative such as deploying ARM templates via Terraform ([Can be seen here](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/template_deployment.html), but it seems very long winded to do it like this when you can just do it via Azure ARM templates.

## Conclusion
Overall, though I do love Terraform due to it's readability, ease of use and many of the other biased points that I've stated above. I think going on from here until Terraform is updated I will be using Azure ARM templates, due to the up to date resources and the ease of setting up deployment. I can also see it being used more for CI/CD pipelines going forward and I do love a challenge.... Disclaimer: This was written at 4am so please excuse any errors that are in this! Yours faithfully, An Aspiring DevOps Guy