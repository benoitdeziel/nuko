import { LocalDeploymentExecutorSchema } from './schema';
import executor from './executor';

const options: LocalDeploymentExecutorSchema = {
  command: 'install',
  debug: false,
};

describe('LocalDeployment Executor', () => {
  it('can run', async () => {
    const output = await executor(options, undefined);
    expect(output.success).toBe(true);
  });
});
