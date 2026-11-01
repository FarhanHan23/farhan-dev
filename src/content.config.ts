import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const post = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/post" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false)
    })
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./content/projects" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        url: z.string().url().optional(),
        github: z.string().url().optional(),
        tags: z.array(z.string()),
        featured: z.boolean().default(false)
    })
});

export const collections = { post, projects };