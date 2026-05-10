import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const docsSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  group: z.enum(['start', 'reference', 'recipes']),
})

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: docsSchema,
})

export const collections = { docs }
export type DocsFrontmatter = z.infer<typeof docsSchema>
