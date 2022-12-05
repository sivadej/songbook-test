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
  addSong: publicProcedure
    .input(z.object({ title: z.string(), artist: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.song.create({
        data: {
          title: input.title,
          artist: input.artist,
        },
      });
    }),
  deleteSong: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.song.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getRandom: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.song.count();
    return ctx.prisma.song.findFirst({
      skip: Math.floor(Math.random() * count),
    });
  }),
  getAllSongs: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.song.findMany();
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
              },
            },
            {
              artist: {
                contains: input.search,
              },
            },
          ],
        },
      });
    }),
});
