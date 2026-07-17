import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">
              <Translate id="homepage.tagline">
                Your personal media server — movies, shows, music, podcasts, books and comics, self-hosted on your own hardware.
              </Translate>
            </p>
            <div className={styles.buttons}>
              <Link className="button button--secondary button--lg" to="/player">
                <Translate id="homepage.cta.player">Get the player</Translate>
              </Link>
              <Link className="button button--outline button--secondary button--lg" to="/chart">
                <Translate id="homepage.cta.helm">Install with Helm</Translate>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img
              src={useBaseUrl('/img/hero-home.png')}
              alt={translate({
                id: 'homepage.hero.alt',
                message: 'Ister player home screen',
              })}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

const sections = [
  {
    title: <Translate id="homepage.section.player">Player guide</Translate>,
    description: (
      <Translate id="homepage.section.player.desc">
        Watch, listen and read on your phone, TV, desktop or in the browser.
      </Translate>
    ),
    to: '/player',
  },
  {
    title: <Translate id="homepage.section.server">Server administration</Translate>,
    description: (
      <Translate id="homepage.section.server.desc">
        Install, configure and maintain the Ister media server.
      </Translate>
    ),
    to: '/server',
  },
  {
    title: <Translate id="homepage.section.chart">Helm chart</Translate>,
    description: (
      <Translate id="homepage.section.chart.desc">
        Deploy the full stack to Kubernetes with a single Helm install.
      </Translate>
    ),
    to: '/chart',
  },
  {
    title: <Translate id="homepage.section.development">Development</Translate>,
    description: (
      <Translate id="homepage.section.development.desc">
        Architecture documentation for contributors to the player and server.
      </Translate>
    ),
    to: '/development',
  },
];

function DocSections() {
  return (
    <section className={styles.sections}>
      <div className="container">
        <Heading as="h2" className={styles.sectionsTitle}>
          <Translate id="homepage.sections.title">Documentation</Translate>
        </Heading>
        <div className="row">
          {sections.map((section, idx) => (
            <div className="col col--3" key={idx}>
              <Link to={section.to} className={clsx('card', styles.sectionCard)}>
                <div className="card__header">
                  <Heading as="h3">{section.title}</Heading>
                </div>
                <div className="card__body">
                  <p>{section.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.tagline}
      description="Documentation for Ister, the self-hosted media server: player guide, server administration, Helm chart installation and architecture docs.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <DocSections />
      </main>
    </Layout>
  );
}
