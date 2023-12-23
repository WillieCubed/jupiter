import AddOfficer from '@src/components/admin/AddOfficer';
import OfficerTable from '@src/components/admin/OfficerTable';
import OrgDescription from '@src/components/admin/OrgDescription';
import { db } from '@src/server/db';
import { api } from '@src/trpc/server';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type Props = { params: { id: string } };

export default async function Page({ params: { id } }: Props) {
  const org = await db.query.club.findFirst({
    where: (club) => eq(club.id, id),
  });
  if (!org) notFound();

  const officers = await api.club.getOfficers.query({ id: org.id });
  return (
    <div className="m-5 h-screen md:pl-72">
      <h1 className="text-center text-4xl font-bold">{org.name}</h1>
      <h2 className="text-center text-2xl font-bold">Officers</h2>
      <div className="flex items-center justify-between">
        <AddOfficer clubId={org.id} />
        <OrgDescription club={org} />
      </div>
      <OfficerTable officers={officers} />
    </div>
  );
}
