import { EventHeader } from '@src/components/BaseHeader';
import { db } from '@src/server/db';
import { events } from '@src/server/db/schema';
import { eq } from 'drizzle-orm';
import { type Metadata } from 'next';

import TimeComponent from './TimeComponent';
import wave from "public/images/Wave.jpg"
import Image from 'next/image';
import CountdownTimer from './CountdownTimer';
import LikeButton from '@src/components/LikeButton';

type Params = { params: { id: string } };

export default async function EventsPage({ params }: Params) {
  const res = await db.query.events.findFirst({
    where: eq(events.id, params.id),
    with: { club: true },
  });

  if (!res) return <div>Event Not Found.</div>;

  const { club, ...event } = res;

  const clubTags = ['Software', 'Innovation', 'Other']

  const clubDescription = ['Club', 'President', 'Location', 'Multi-Day']
  const clubDetails = [club.name, 'John Doe', 'ESCW 1.232', 'No']


  return (
  
    <main className="w-full md:pl-72">
      <EventHeader />

      <section className="mb-5 flex flex-col space-y-6 px-7">
        <div className="relative h-full w-full rounded-xl p-10 shadow-lg flex justify-between bg-[url('/images/wideWave.jpg')] bg-cover  ">
          <section className='text-white'>
            <div className="flex ">
              {clubTags.map( (tag) => (
                <p
                  key={tag}
                  className=" mr-5 pt-4 pb-12 font-semibold "
                >
                  {tag}
                </p>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {event.name}
            </h1>
            <TimeComponent date={event.startTime.toLocaleString()} />
          </section>
          <section className="float-right my-auto flex">
            <button
                className="rounded-full bg-blue-400 p-2.5 transition-colors hover:bg-blue-700 mr-12"
                type="button"
            >
              <LikeButton />
            </button>
            <button className="rounded-full bg-blue-primary px-8 py-4 text-xs font-extrabold text-white transition-colors hover:bg-blue-700 mr-8">
              Register
            </button>
          </section>
        </div>
      </section>

      <section className="mb-5 flex flex-col space-y-6 px-7 text-black">
        <div className="relative h-full w-full rounded-xl p-10 shadow-lg flex ">
          <div className="flex  w-max m-4">
              <div className="h-full lg:min-w-fit max-w-sm">
                <div className='relative h-40 w-full rounded-b-md overflow-hidden mx-auto '>
                  <Image src={wave} alt="wave" layout="fill" objectFit='cover' />
                </div>
                <div>
                  <h1 className=" mt-10 text-sm text-gray-700 font-semibold">
                    Description
                  </h1>
                  
                  <div >
                    {clubDescription.map( (details, index) => (
                      <div 
                       key={details}
                       className="flex text-xs justify-between my-5 text-slate-700"
                      >
                        <p className="mr-5">
                          {details}
                        </p>
                        <p className="font-semibold text-right ">
                          {clubDetails[index]}
                        </p>
                      </div>
                    ))
                    }
                  </div>
                </div>
              </div>

              <div className="mx-12 text-sm flex-grow">
                <p className="text-slate-700">
                  {club.description}
                </p>
                <p className="text-gray-500 mt-4">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col ">
                  <h1 className="text-gray-600 font-semibold text-sm">
                    Starts in
                  </h1>
                  <div className="flex justify-start mt-5">
                    <CountdownTimer startTime= {event.startTime} />
                  </div>
                  <div className="flex justify-start font-medium text-gray-400 text-sm mt-5">
                    <p className="mr-7">Days</p>
                    <p className="mr-6">Hours</p>
                    <p className="mr-6">Minutes</p>
                    <p>Seconds</p>
                  </div>

                  <button className="mt-auto block w-full rounded-full border-2 border-blue-primary py-4 text-xs font-extrabold text-blue-primary transition-colors hover:text-white hover:bg-blue-700 mr-8 break-normal">
                    View Club
                  </button>
              </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;

  const found = await db.query.events.findFirst({
    where: eq(events.id, id),
    with: { club: true },
  });
  if (!found)
    return {
      title: 'Event not found',
      description: 'Event not found',
    };

  return {
    title: `${found.name} - Jupiter`,
    description: found.description.slice(0, 30) + '...',
    alternates: {
      canonical: `https://jupiter.utdnebula.com/event/${found.id}`,
    },
    openGraph: {
      url: `https://jupiter.utdnebula.com/event/${found.id}`,
      description: found.name + ' - Jupiter',
    },
  };
}
