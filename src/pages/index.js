import React from "react";
import {
  AboutSection,
  ArticlesSection,
  ContactSection,
  HeroSection,
  InterestsSection,
  Page,
  ProjectsSection,
  Seo,
} from "gatsby-theme-portfolio-minimal";

/*
* Removed some sections
*         <ProjectsSection sectionId="features" heading="Built-in Features" />
*/
export default function IndexPage() {
  return (
    <>
      <Seo title="Gatsby Starter for Portfolio Minimal" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <ArticlesSection sectionId="articles" heading="Latest Blogs" sources={['Blog']} />
        <AboutSection sectionId="about" heading="About Stan" />
        <InterestsSection sectionId="details" heading="Details" />

        <ContactSection sectionId="github" heading="Issues?" />
      </Page>
    </>
  );
}
