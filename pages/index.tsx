import Head from 'next/head';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import TagFilter from '../components/TagFilter';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import DbProvider from '../backend_tools/db_provider';
import Club from '../models/club';
import OrgDirectoryGrid from '../components/OrgDirectoryGrid';

const Home = ({ data }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>Jupiter</title>
        <meta name="description" content="Jupiter - Nebula Labs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="md:pl-72">
        <Header />
        <div className="relative w-full block">
          <Carousel />
        </div>
        <TagFilter />
        <OrgDirectoryGrid clubs={data} />
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{ data: Club[] }> = async (ctx) => {
  const db = new DbProvider();
  const clubs = await db.getAllClubs();

  if (!clubs)
    return {
      notFound: true,
    };

  return {
    props: {
      data: clubs,
    },
  };
};

export default Home;
