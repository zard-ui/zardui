import { spawnSync } from 'node:child_process';
import concurrently from 'concurrently';

const port = process.env.PORT || '4222';

const prebuild = spawnSync('npm run generate:highlight', { stdio: 'inherit', shell: true });
if (prebuild.status !== 0) process.exit(prebuild.status ?? 1);

const { result } = concurrently(
  [
    {
      name: 'highlight',
      prefixColor: 'magenta',
      command: 'npm run generate:highlight -- --watch',
    },
    {
      name: 'web',
      prefixColor: 'cyan',
      command: `npx nx run web:serve --configuration=local --port=${port}`,
    },
  ],
  {
    killOthersOn: ['failure'],
    prefix: 'name',
  },
);

result.then(
  () => process.exit(0),
  () => process.exit(1),
);
