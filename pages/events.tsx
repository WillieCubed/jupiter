import React from 'react';
import Head from 'next/head';

export default function events() {
  return (
    <div>
      <Head>
        <title>Jupiter Events</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-row w-full gap-10 px-8">
        <div className="w-1/4">Filters Placeholder</div>
        <div className="flex flex-col w-3/4">
          <h1 className="text-4xl font-medium">Events</h1>
          <div className="flex flex-row justify-end">
            <input type="search" placeholder="Search Events" />
          </div>
        </div>
      </div>
    </div>
  );
}
