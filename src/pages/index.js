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
        <ArticlesSection sectionId="articles" heading="Latest Blog Articles &#128221;" sources={['blog']} />
        <AboutSection sectionId="about" heading="A little bit about me &#128526;" />
        <InterestsSection sectionId="details" heading="My DevOps Toolbox &#129520;&#9874;" />
      </Page>
    </>
  );
}
