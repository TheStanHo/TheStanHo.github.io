

## How deployment works

We have two branches main and deployment. 
Main will contain the code and deployment will contain the actual build files required to spin up the page.

Because of the below script in packages when we run npm run deploy it will push the files to the deployment branch
```
"deploy": "gatsby build && gh-pages -d public -b deployment",
```