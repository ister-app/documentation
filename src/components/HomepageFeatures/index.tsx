import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: ReactNode;
  icon: string;
  description: ReactNode;
  to: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: <Translate id="homepage.feature.library">Media library & metadata</Translate>,
    icon: '🗂️',
    description: (
      <Translate id="homepage.feature.library.desc">
        Point Ister at your movies, shows, music, podcasts, books and comics and
        it scans, matches and enriches everything with artwork and metadata.
      </Translate>
    ),
    to: '/server',
  },
  {
    title: <Translate id="homepage.feature.transcoding">On-the-fly transcoding</Translate>,
    icon: '🎞️',
    description: (
      <Translate id="homepage.feature.transcoding.desc">
        FFmpeg-powered transcoding adapts any source file to your device and
        bandwidth, from 4K on the couch to mobile data on the go.
      </Translate>
    ),
    to: '/development/server/transcoding',
  },
  {
    title: <Translate id="homepage.feature.player">Player on every screen</Translate>,
    icon: '📱',
    description: (
      <Translate id="homepage.feature.player.desc">
        One Flutter app for Android, Android TV, Linux desktop and the browser —
        watch, listen and read wherever you are.
      </Translate>
    ),
    to: '/player',
  },
  {
    title: <Translate id="homepage.feature.search">Full-text search</Translate>,
    icon: '🔍',
    description: (
      <Translate id="homepage.feature.search.desc">
        Typesense-backed instant search across your whole library: titles,
        people, genres and more.
      </Translate>
    ),
    to: '/server/search-typesense',
  },
  {
    title: <Translate id="homepage.feature.multiuser">Multi-user & party mode</Translate>,
    icon: '👪',
    description: (
      <Translate id="homepage.feature.multiuser.desc">
        Every household member gets their own watch state and continue-watching
        row — or watch together in party mode.
      </Translate>
    ),
    to: '/player/party-mode',
  },
  {
    title: <Translate id="homepage.feature.helm">One-command Helm install</Translate>,
    icon: '⎈',
    description: (
      <Translate id="homepage.feature.helm.desc">
        A single Helm chart deploys the server, web player, PostgreSQL,
        RabbitMQ and Typesense to any Kubernetes cluster.
      </Translate>
    ),
    to: '/server/installation-helm',
  },
];

function Feature({title, icon, description, to}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className="text--center">
        <span className={styles.featureIcon} role="img" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">
          <Link to={to} className={styles.featureLink}>
            {title}
          </Link>
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
