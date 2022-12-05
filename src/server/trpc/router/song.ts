import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const songRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.song.findMany();
  }),
  getRandom: publicProcedure.query(async ({ ctx }) => {
    // get song count
    const count = await ctx.prisma.song.count();
    return ctx.prisma.song.findFirst({
      skip: Math.floor(Math.random() * count),
    });
  }),
  getByTitleOrArtist: publicProcedure
    .input(z.object({ search: z.string() }))
    .query(({ ctx, input }) => {
    return ctx.prisma.song.findMany({
      where: {
        OR: [
          {
            title: {
              contains: input.search,
            }
          },
          {
            artist: {
              contains: input.search,
            }
          },
        ],
      },
    });
  }),
});
