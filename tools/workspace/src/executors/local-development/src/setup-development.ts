import { exec } from 'child_process';
import { installDocker } from '../../../utils/install-docker';
import { runCommand } from '../../../utils/run-command';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function setupDevEnvironment(debugEnabled: boolean) {
  const composeFilePath = 'infrastructure/dev/docker-compose.yml';

  try {
    try {
      await runCommand('docker', ['info']);
    } catch {
      await installDocker();
    }

    console.log('Stopping any existing Docker Compose services...');
    await execAsync(`docker-compose -f ${composeFilePath} down`);
    console.log('Services stopped ✅');

    console.log('Building and starting Docker Compose services...');
    await execAsync(`docker-compose -f ${composeFilePath} up -d --build`);
    console.log('Services started ✅');
  } catch (error) {
    console.error('Error setting up the development environment:', error);

    throw new Error(
      'Issue while setting up the development environment. Please ensure Docker is running.',
    );
  }
}
