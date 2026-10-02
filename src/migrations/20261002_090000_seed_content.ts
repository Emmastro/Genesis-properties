import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { seed } from '../seed'

// Loads the starter content (developments, units, services, photos) the first
// time migrations run against an empty database — e.g. the first Vercel deploy.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seed({ payload, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content is left in place; delete it from the studio if needed.
}
