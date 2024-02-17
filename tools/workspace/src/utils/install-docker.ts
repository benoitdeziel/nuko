import { existsSync, unlink } from 'node:fs';
import { runCommand } from './run-command';
import { spawn } from 'node:child_process';

export async function installDocker() {
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
