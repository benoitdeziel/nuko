import { installIfMissing } from '../../../utils/install-command';
import { installDocker } from '../../../utils/install-docker';
import { runCommand } from '../../../utils/run-command';

export async function checkRequirements() {
  await installIfMissing('minikube', 'brew', ['install', 'minikube']);

  try {
    await runCommand('bash', ['-c', 'eval $(minikube -u minikube docker-env)']);
    await runCommand('docker', ['info']);
  } catch {
    await installDocker();
  }

  await installIfMissing('helm', 'brew', ['install', 'helm']);
  await installIfMissing('kubectl', 'brew', ['install', 'kubectl']);
}
