import * as migration_20261002_084634_initial from './20261002_084634_initial';
import * as migration_20261002_090000_seed_content from './20261002_090000_seed_content';

export const migrations = [
  {
    up: migration_20261002_084634_initial.up,
    down: migration_20261002_084634_initial.down,
    name: '20261002_084634_initial',
  },
  {
    up: migration_20261002_090000_seed_content.up,
    down: migration_20261002_090000_seed_content.down,
    name: '20261002_090000_seed_content'
  },
];
