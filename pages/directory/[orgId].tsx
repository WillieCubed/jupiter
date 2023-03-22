import React from 'react';
import DirectoryOrgHeader from '../../components/OrgHeader';
import Head from 'next/head';
import Image from 'next/image';
import ContactList from '../../components/ContactList';
import DbProvider from '../../backend_tools/db_provider';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Club, { getImage } from '../../models/club';

const OrganizationPage = ({
  club,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>{club.name} - Jupiter</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex md:grid md:grid-cols-6 gap-4 p-10">
          <DirectoryOrgHeader name={club.name} tags={[]} />
        </div>
        <div className="flex md:grid md:grid-cols-6 gap-4 px-10">
          <div className="md:col-span-3">
            <h1 className="text-2xl md:text-3xl font-bold">
              {`About ${club.name}`}
            </h1>
          </div>
          <div className="col-start-[-3] col-span-2 text-left">
            <h1 className="text-2xl md:text-3xl font-bold px-3">Contact Us</h1>
          </div>
        </div>
        <div className="flex md:grid md:grid-cols-6 gap-4 p-10">
          <div className="md:col-span-2">
            <Image
              src={getImage(club)}
              alt={club.name}
              width={250}
              height={250}
            />
          </div>
          <div className="md:col-span-2">
            <p>{club.description}</p>
          </div>
          <div className="md:col-span-2">
            <ContactList contactMethods={['Discord', 'Email', 'Instagram']} />
          </div>
        </div>
      </main>
    </>
  );
};

export default OrganizationPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const db = new DbProvider();
  const clubs = await db.getAllClubs();
  if (!clubs)
    return {
      paths: [],
      fallback: false,
    };
  const paths = clubs.map(({ id }) => ({
    params: { orgId: id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ club: Club }> = async ({
  params,
}) => {
  const db = new DbProvider();
  const orgId = params?.orgId as string;
  const club = await db.getClubById(orgId);
  if (!club)
    return {
      notFound: true,
    };
  return {
    props: { club },
  };
};