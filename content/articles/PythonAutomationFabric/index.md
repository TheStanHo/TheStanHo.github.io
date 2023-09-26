---
title: "Python Scripting with Fabric"
description: "Python Scripting with Fabric"
date: "2023-08-26"
banner:
  src: "../../images/chris-ried-ieic5Tq8YMk-unsplash.jpg"
  alt: "Python Background"
  caption: 'Photo by <u><a href="https://unsplash.com/photos/ieic5Tq8YMk">Chris Ried</a></u>'
categories:
  - "Scripting"
  - "Monitoring"
  - "Python"
keywords:
  - "Scripting"
  - "Monitoring"
  - "Python"
  - "Blog"
  - "Fabric"
---
Having scripted mostly in Powershell & Bash the majority of my DevOps career (all of 3 years). I thought I would dabble in some Python scripting one evening. I have some Python experience having learned some basics during my Masters degree, I thought I might as well use this opportunity to refresh myself in the beloved language by many Software Developers and DevOps Engineers alike.

## Choosing the Module
The module I chose to experiment with this evening was one that I read about online called "[Fabric](https://www.fabfile.org/)". It is described as a "... high level Pyton library designed to execute shell commands remotely over SSH, yielding Python objects in return". I chose this module to play around with this evening as I myself find it a hassle sometimes to run commands on linux VMs. Utlising this module we can:
- Run commands on individual or multiple hosts at a time 
- Automate commands that are used frequently either to solve issues or we can write Python script functions to 

## Setting up the local environment
To play with the Fabric module I created a local Docker Image to run locally on my PC. 
DockerFile based on the one [here](https://dev.to/s1ntaxe770r/how-to-setup-ssh-within-a-docker-container-i5i)

```dockerfile
FROM ubuntu:latest

RUN apt update && apt install  openssh-server sudo -y
RUN useradd -rm -d /home/ubuntu -s /bin/bash -g root -G sudo -u 1000 pythonScriptUser
RUN  echo 'pythonScriptUser:test123' | chpasswd
RUN service ssh start

EXPOSE 22

CMD ["/usr/sbin/sshd","-D"]
```

As well as this of course I had to have Python as well as pip install the fabric module

## Creating the script
I decided to just create functions for different operations for easier reusability. Though obviously the script can be improved if it were to actually be used in a working environment (remember this was just for me to mess around with!). 

```python
from fabric import *

#Initiate the connection to the host
def ssh_connection():
    config = Config(overrides={'user': 'pythonScriptUser', 'connect_kwargs': {'password': 'test123'}, 'sudo': {'password': 'test123'}})
    conn = Connection("127.0.0.1", user="pythonScriptUser", config=config, port=22)
    return conn

#run the uptime command
def uptime():
    ssh_connection().run('uptime')

#Install the array of packages given to the function
def installPackages(packages):    
    for package in packages:
        print("installing "+package)
        ssh_connection().sudo("apt install "+ package +" -y")

#run the nslookup command
def nslookup(hostname):
    ssh_connection().run("nslookup "+hostname)

#upload a file to the host given the source of the file and the destination
def uploadFile(source,destination):
    print("uploading "+ source +" to "+ destination)
    ssh_connection().put(source, destination)

#download file from the source to the destination
def downloadFile(source,destination):
    print("downloading "+ source +" from "+ destination)
    ssh_connection().get(source,destination)

# below we are just running the functions that were created above
packages = ["vim","neofetch", "net-tools","dnsutils","curl"]
installPackages(packages)

nslookup("www.google.com")

uploadFile("C:\\temp\\transfer-test.txt","/home/ubuntu")

downloadFile("/etc/adduser.conf","C:\\temp\\test.txt")

#cd with context manager. As just doing ssh_connection().run("cd /var") wouldn't work
with ssh_connection().cd("/var"):
    ssh_connection().run("pwd")

```

## Overall
I believe from this small demonstration and having played around with it (for all of 2 hours) that in future if possible, in my job I will try utilise Python when given the opportunity. Python can be used in DevOps lifecycle for such things as automation, configuration management and provisoning. The fact also that it can be ran on the linux and windows OS is also an additional benefit. I personally have had issues when trying to create cronjobs using powershell running on a linux OS due to the size of the image and workarounds I had to implement. But using Python we can potentially overcome these issues.

From my point of view the benefits of this are:
- Easily readable code - Python is known to be "user-friendly" as the way you code in it, is very readable and as a result the code itself is "documentation". If the actual documentation is missing (Though it shouldn't be the case, right?😉). It also allows for better efficency and production due to this simple syntax
- Vast amount of available modules/libraries - If there is something you want to script with Python it most likely already been done or the foundations are already out there
- Huge community - Means modules and scripts are probably already existing out there
