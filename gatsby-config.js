module.exports = {
  plugins: [
    {
      resolve: "gatsby-theme-portfolio-minimal",
      options: {
        siteUrl: "https://thestanho.github.io/", // Used for sitemap generation
        manifestSettings: {
          favicon: "./content/images/favicon.png", // Path is relative to the root
          siteName: "StanHo - DevOps Engineer", // Used in manifest.json
          shortName: "StanHo - Portfolio", // Used in manifest.json
          startUrl: "/", // Used in manifest.json
          backgroundColor: "#FFFFFF", // Used in manifest.json
          themeColor: "#000000", // Used in manifest.json
          display: "minimal-ui", // Used in manifest.json
        },
        contentDirectory: "./content",
        blogSettings: {
          path: "/blog", // Defines the slug for the blog listing page
          usePathPrefixForArticles: false, // Default true (i.e. path will be /blog/first-article)
        },
        googleAnalytics: {
            trackingId: "G-KS5Q91DQZG", //old Tracking ID UA-131674608-1
            anonymize: true, // Default true
            environments: ["production"] // Default ["production"]
        }
      },
    },
  ],
};
