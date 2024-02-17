import { spawn } from 'child_process';
import { existsSync, unlink } from 'node:fs';

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

function runCommand(command, args = [], options = {}) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      stdio: ['ignore', 'inherit', 'inherit'], // Suppressed stdout for checking installation
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
    await runCommand(command, [], { stdio: 'ignore' }); // Don't print the result of the command
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

async function installDocker() {
  const dockerDmgPath = './Docker.dmg';
  const dockerDmgUrl = 'https://desktop.docker.com/mac/main/arm64/Docker.dmg';
  const username = await getCurrentUsername();
  await downloadDockerDmg(dockerDmgUrl, dockerDmgPath);

  console.log('Mounting Docker.dmg...');
  await runCommand('sudo', ['hdiutil', 'attach', dockerDmgPath]);

  console.log('Installing Docker...');
  await runCommand('sudo', [
    '/Volumes/Docker/Docker.app/Contents/MacOS/install',
    '--accept-license',
    `--user=${username}`,
  ]);

  console.log('Detaching Docker.dmg...');
  await runCommand('sudo', ['hdiutil', 'detach', '/Volumes/Docker']);

  await cleanUpDockerDmg(dockerDmgPath);
  await waitForDocker();
  console.log('Docker installation completed.');
}

async function downloadDockerDmg(url, outputPath) {
  if (!existsSync(outputPath)) {
    console.log(`Downloading Docker from ${url}...`);
    await runCommand('curl', ['-L', url, '-o', outputPath]).catch((error) => {
      throw new Error(`Failed to download Docker: ${error}`);
    });
  } else {
    console.log('Docker .dmg already downloaded.');
  }
}

async function waitForDocker() {
  console.log('Starting Docker for Mac');
  await runCommand('open', ['-a', '/Applications/Docker.app']);
  return new Promise<void>((resolve) => {
    const checkDocker = () => {
      runCommand('docker', ['stats', '--no-stream'])
        .then(() => {
          console.log('\nDocker is ready');
          resolve();
        })
        .catch(() => {
          process.stdout.write('.');
          setTimeout(checkDocker, 1000);
        });
    };
    checkDocker();
  });
}

function cleanUpDockerDmg(filePath) {
  unlink(filePath, (err) => {
    if (err) {
      console.error(`Failed to delete ${filePath}: ${err}`);
      throw err;
    } else {
      console.log(`${filePath} was successfully deleted.`);
    }
  });
}

async function getCurrentUsername() {
  return new Promise((resolve, reject) => {
    const command = spawn('whoami');
    let username = '';
    command.stdout.on('data', (data) => {
      username += data.toString().trim();
    });
    command.on('close', (code) => {
      if (code === 0) {
        resolve(username);
      } else {
        reject(new Error('Failed to get current username'));
      }
    });
  });
}
