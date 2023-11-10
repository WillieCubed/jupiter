import { eq, ilike, sql } from 'drizzle-orm';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { selectClub } from '@src/server/db/models';
import { club } from '@src/server/db/schema';
const byNameSchema = z.object({
  name: z.string().default(''),
});

const byIdSchema = z.object({
  id: z.string().default(''),
});

const allSchema = z.object({
  tag: z.string().nullish(),
});

export const clubRouter = createTRPCRouter({
  byName: publicProcedure.input(byNameSchema).query(async ({ input, ctx }) => {
    const { name } = input;
    const clubs = await ctx.db.query.club.findMany({
      where: (club) => ilike(club.name, `%${name}%`),
    });

    if (name === '') return clubs.map((c) => selectClub.parse(c));

    return clubs.slice(0, 5);
  }),
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const { id } = input;
    try {
      const byId = await ctx.db.query.club.findFirst({
        where: (club) => eq(club.id, id),
        with: { contacts: true },
      });

      return byId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }),
  all: publicProcedure.input(allSchema).query(async ({ ctx, input }) => {
    try {
      let query = ctx.db.select().from(club);
      if (input.tag && typeof input.tag == 'string' && input.tag !== 'All')
        query = query.where(sql`${input.tag} = ANY(tags)`);
      query = query.orderBy(sql`RANDOM()`).limit(20);
      const res = await query;
      const parsed = res.map((q) => selectClub.parse(q));
      return parsed;
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
});
