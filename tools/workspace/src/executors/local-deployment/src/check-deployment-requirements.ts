import { spawn } from 'child_process';

function runCommand(command, args = [], options = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      stdio: 'inherit',
      ...options,
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `Command "${command} ${args.join(' ')}" exited with code ${code}`,
          ),
        );
      }
    });
  });
}

async function installIfMissing(command, installCommand, installArgs = []) {
  try {
    console.log(`Checking if ${command} is installed...`);
    await runCommand(command);
    console.log(`${command} is installed.`);
  } catch {
    console.log(`${command} is not installed, installing...`);
    await runCommand(installCommand, installArgs).catch(() => {
      throw new Error(
        `Failed to install ${command}. Please install it manually.`,
      );
    });
  }
}

export async function checkRequirements() {
  await installIfMissing('minikube', 'brew', ['install', 'minikube']);

  try {
    await runCommand('bash', ['-c', 'eval $(minikube -u minikube docker-env)']);
    await runCommand('docker', ['info']);
  } catch {
    await installIfMissing('docker', 'brew', ['install', 'docker']);
  }

  await installIfMissing('helm', 'brew', ['install', 'helm']);
  await installIfMissing('kubectl', 'brew', ['install', 'kubectl']);
}
