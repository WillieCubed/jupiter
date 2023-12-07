'use client';
/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod';
import ContactSelector from '@src/components/CreateContactSelector';
import OfficerSelector from '@src/components/OfficerSelector';
import { api } from '@src/trpc/react';
import { createClubSchema } from '@src/utils/formSchemas';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

const CreateClubForm = ({ user }: { user: { id: string; name: string } }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createClubSchema>>({
    resolver: zodResolver(createClubSchema),
    defaultValues: {
      officers: [
        {
          id: user.id,
          name: user.name,
          president: true,
          locked: true,
          position: 'President',
        },
      ],
    },
  });
  const router = useRouter();
  const createClub = api.club.create.useMutation({
    onSuccess: (id) => router.push(`/directory/${id}`),
  });
  const submitForm = handleSubmit((data) => {
    if (!createClub.isLoading) {
      createClub.mutate(data);
    }
  });
  return (
    <form onSubmit={submitForm}>
      <div className="flex h-full w-full flex-col gap-y-5 p-5">
        <div className="w-full rounded-md bg-slate-100 p-5 shadow-sm">
          <h1 className="text-lg font-extrabold text-black">
            Create new Organization
          </h1>
        </div>
        <div className="w-full rounded-md bg-slate-100 p-5 shadow-sm">
          <h2>Organization name</h2>
          <input
            type="text"
            id="name"
            className=" w-full bg-transparent"
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div className="h-44 w-full rounded-md bg-slate-100 p-5 shadow-sm">
          <h2>Description</h2>
          <textarea
            id="desc"
            className="h-24 w-full"
            {...register('description')}
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="w-full rounded-md bg-slate-100 p-5 shadow-sm">
          <OfficerSelector
            control={control}
            register={register}
            errors={errors}
          />
        </div>
        <div className="w-full rounded-md bg-slate-100 p-5 shadow-sm">
          <ContactSelector
            control={control}
            register={register}
            errors={errors}
          />
        </div>
        <button>submit</button>
      </div>
    </form>
  );
};
export default CreateClubForm;