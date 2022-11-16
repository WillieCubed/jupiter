import React from 'react';
import Head from 'next/head';
import OrgDirectoryHeader from '../../components/OrgDirectoryHeader';
import OrgDirectorySidebar from '../../components/OrgDirectorySidebar';
import OrgDirectoryGrid from '../../components/OrgDirectoryGrid';

const DirectoryHead = () => (
  <Head>
    <title>Directory - Jupiter</title>
    <meta name="description" content="Generated by create next app" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
);

export default function Directory() {
  return (
    <>
      <DirectoryHead />
      <main>
        <div className="p-5">
          <OrgDirectoryHeader />
        </div>
        <div className="md:flex md:flex-row">
          <OrgDirectorySidebar />
          <OrgDirectoryGrid />
        </div>
      </main>
    </>
  );
}
