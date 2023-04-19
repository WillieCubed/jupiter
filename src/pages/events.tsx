import EventsSidebar from "./../components/EventsSidebar";
import EventsHeader from "../components/EventsHeader";
import React from "react";
import Head from "next/head";
import EventList from "../components/EventList";

export default function Events() {
  return (
    <>
      <Head>
        <title>Jupiter Events</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="grid gap-x-4 p-5 md:grid-cols-6">
          <EventsHeader />
        </div>
        <div className="grid gap-x-4 p-5 md:grid-cols-6">
          <EventsSidebar />
          <EventList />
        </div>
      </main>
    </>
  );
}