import Head from 'next/head';
import { EventHeader } from '../components/Header';
import { GridIcon, ListIcon } from '@src/components/Icons';
import { Fragment, useState } from 'react';
import EventSidebar, {
  type filters,
  type filterState,
} from '@src/components/events/EventSidebar';
import { api } from '@src/utils/api';
import EventCard from '@src/components/events/EventCard';
import { DateTime } from 'luxon';

function getStartTime(filter: (typeof filters)[number]) {
  switch (filter) {
    case 'Upcoming Events':
      return 'now';
    case 'Last weeks events':
      return { days: -7 };
    case 'Last month events':
      return { days: -30 };
  }
}

const Events = () => {
  const [view, setView] = useState<'horizontal' | 'vertical'>('horizontal');
  const [filterState, setFilterState] = useState<filterState>({
    filter: 'Upcoming Events',
    club: [],
    order: 'soon',
    types: [],
  });
  const eventQuery = api.event.fromDateRange.useInfiniteQuery(
    {
      startTime: getStartTime(filterState.filter),
      club: filterState.club.map((val) => val.id),
      order: filterState.order,
      limit: 20,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  return (
    <>
      <Head>
        <title>Jupiter</title>
        <meta name="description" content="Events - Jupiter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="pb-10 md:pl-72">
        <EventHeader />
        <div className="w-full px-6">
          <div className="flex flex-row pb-12 pt-4">
            <h1 className="text-2xl font-bold text-[#4D5E80]">Events</h1>
            <div className="ml-auto flex flex-row gap-x-16">
              <button
                type="button"
                className={`flex flex-row items-center gap-x-4 ${
                  view === 'horizontal'
                    ? ' -mr-7.5 rounded-full bg-white px-7.5 py-2.5'
                    : ''
                }`}
                onClick={() => {
                  setView('horizontal');
                }}
              >
                <div className="h-7.5 w-7.5">
                  <ListIcon />
                </div>
                <p className="text-sm font-bold text-blue-primary">List view</p>
              </button>
              <button
                type="button"
                className={`flex flex-row items-center  ${
                  view == 'vertical'
                    ? '-ml-7.5 rounded-full bg-white px-7.5 py-2.5'
                    : 'mr-7.5'
                }`}
                onClick={() => {
                  setView('vertical');
                }}
              >
                <div className="h-7.5 w-7.5">
                  <GridIcon />
                </div>
                <p className="text-sm font-bold text-blue-primary">Grid view</p>
              </button>
            </div>
          </div>
          <div className="container flex w-full flex-row space-x-7.5">
            <EventSidebar
              filterState={filterState}
              setFilterState={setFilterState}
            />
            <div
              className={
                view === 'horizontal'
                  ? 'flex w-full flex-col space-y-7.5 pt-10'
                  : 'flex flex-wrap gap-x-10 gap-y-7.5'
              }
            >
              {eventQuery.status === 'success' &&
                eventQuery.data.pages.map((page) => {
                  return (
                    <Fragment key={page.nextCursor}>
                      {page.events.map((event) => (
                        <EventCard key={event.id} view={view} event={event} />
                      ))}
                    </Fragment>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Events;
