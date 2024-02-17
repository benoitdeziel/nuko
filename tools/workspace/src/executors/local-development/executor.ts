import { ExecutorSchema } from './schema';
import { setupDevEnvironment } from './src/setup-development';

export default async function runExecutor(options: ExecutorSchema) {
  let success = true;
  console.log('Executor ran for ', options);

  try {
    await setupDevEnvironment(options.debug || false);
  } catch (e) {
    console.error(e);
    success = false;
  }
  return {
    success,
  };
}
