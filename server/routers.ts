import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContact, getContacts, deleteContact } from "./db";
import { systemRouter } from "./_core/systemRouter";
import { logger } from "./logger";

export const appRouter = router({
  system: systemRouter,
  // Contact form procedures
  contacts: router({
    list: publicProcedure.query(async () => {
      logger.info("[API] contacts.list called");
      return await getContacts();
    }),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          email: z.string().email(),
          contact: z.string().min(1).max(20),
          address: z.string().min(1),
          country: z.string().min(1).max(100),
        })
      )
      .mutation(async ({ input }) => {
        logger.info(`[API] contacts.create called for ${input.name}`);
        return await createContact(input);
      }),
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        logger.info(`[API] contacts.delete called for id=${input.id}`);
        return await deleteContact(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
