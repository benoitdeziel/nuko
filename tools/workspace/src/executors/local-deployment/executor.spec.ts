import { LocalDeploymentExecutorSchema } from './schema';
import executor from './executor';

const options: LocalDeploymentExecutorSchema = {};

describe('LocalDeployment Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
