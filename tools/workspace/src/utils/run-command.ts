import { spawn } from 'child_process';

export function runCommand(command, args = [], options = {}) {
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
