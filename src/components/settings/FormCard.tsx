/* eslint-disable @typescript-eslint/no-misused-promises */
'use client';
import { selectClub, type SelectClub } from '@src/server/db/models';
import { type Session } from 'next-auth';
import SettingsDropdown from './SettingsDropdown';
import SettingsInput from './SettingsInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ClubSelector from 'ClubSelector';
import { api } from '@src/trpc/react';

type Props = {
  clubs: { club: SelectClub }[];
  user: Session['user'];
};

const settingsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  major: z.string().min(1),
  minor: z.string().nullable(),
  year: z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior']),
  role: z.enum(['Student', 'Student Organizer', 'Administrator']),
  clubs: selectClub.pick({ name: true, id: true, image: true }).array(),
});

export type SettingSchema = z.infer<typeof settingsSchema>;

export default function FormCard({ clubs, user }: Props) {
  const { register, handleSubmit, control } = useForm<SettingSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      clubs: clubs.map(({ club }) => club),
      firstName: user.firstName,
      lastName: user.lastName,
      major: user.major,
      minor: user.minor,
      role: user.role,
    },
  });

  const { mutate } = api.userMetadata.updateById.useMutation();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate({
          clubs: data.clubs.map((club) => club.id),
          updateUser: {
            ...data,
          },
        });
      })}
    >
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col space-y-6 md:w-2/3">
          <div className="flex space-x-4">
            <SettingsInput
              label="First Name"
              defaultValue={user.firstName}
              name="firstName"
              register={register}
            />
            <SettingsInput
              label="Last Name"
              defaultValue={user.lastName}
              name="lastName"
              register={register}
            />
          </div>
          <div className="flex space-x-4">
            <SettingsInput
              label="Major"
              defaultValue={user.major}
              name="major"
              register={register}
            />
            <SettingsInput
              label="Minor"
              defaultValue={user.minor || ''}
              name="minor"
              register={register}
            />
          </div>
          <div className="flex space-x-4">
            <SettingsDropdown
              label="Year"
              defaultValue={user.year}
              name="year"
              options={['Freshman', 'Sophomore', 'Junior', 'Senior']}
              register={register}
            />
            <SettingsDropdown
              label="Role"
              defaultValue={user.role}
              name="role"
              options={['Student', 'Student Organizer', 'Administrator']}
              disabled
              register={register}
            />
          </div>
        </div>

        {/* Club section */}
        <div className="w-full md:w-1/2">
          <ClubSelector register={register} control={control} />
        </div>
      </div>

      <div className="mt-6 flex justify-between gap-4">
        <button
          type="button"
          className="rounded-full bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
        >
          Delete account
        </button>
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          Apply Changes
        </button>
      </div>
    </form>
  );
}