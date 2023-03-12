

## How deployment works

We have two branches main and deployment. 
Main will contain the code and deployment will contain the actual build files required to spin up the page.

Because of the below script in packages when we run npm run deploy it will push the files to the deployment branch
```
"deploy": "gatsby build && gh-pages -d public -b deployment",
```

## To build locally
Run the below code in terminal
```
npm run deploy
```

## Credit
Template used is by: Konstantin Muenster. The link to the repo is can be found [here](https://github.com/konstantinmuenster/gatsby-theme-portfolio-minimal)
More information about this can be found [here](https://www.gatsbyjs.com/plugins/gatsby-theme-portfolio-minimal/#section-components)