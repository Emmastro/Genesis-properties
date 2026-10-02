// `pnpm seed` — loads the starter content into an empty database.
// The same content is also loaded automatically by the seed migration.
import config from '@payload-config'
import { getPayload } from 'payload'

import { seed } from './index'

const payload = await getPayload({ config })
await seed({ payload })
process.exit(0)
