import { runCommand } from './run-command';

export async function installIfMissing(
  command,
  installCommand,
  installArgs = [],
) {
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
