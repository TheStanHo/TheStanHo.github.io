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
      <Seo title="StanHo" />
      <Page useSplashScreenAnimation>
        <HeroSection sectionId="hero" />
        <ArticlesSection sectionId="articles" heading="Latest Blog Articles" sources={['blog']} />
        <AboutSection sectionId="about" heading="A little bit about me" />
        <InterestsSection sectionId="details" heading="My DevOps Toolbox" />
      </Page>
    </>
  );
}
