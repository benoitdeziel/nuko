import { LocalDeploymentExecutorSchema } from './schema';
import type { ExecutorContext } from '@nx/devkit';
import { checkRequirements } from './src/check-deployment-requirements';
import { setupCluster } from './src/setup-cluster';
import { deployService, deployServices } from './src/deploy-services';
import {
  deployIngressController,
  enableIngressController,
} from './src/deploy-ingress-controller';

export default async function runExecutor(
  options: LocalDeploymentExecutorSchema,
  context: ExecutorContext,
) {
  let success = true;

  console.log('Executor ran for LocalDeployment', options);
  try {
    await runLocalDeployment(options);
  } catch (e) {
    console.log(e);
    success = false;
  }
  return {
    success,
  };
}

async function runLocalDeployment(options) {
  const { command, debug = false, service = '' } = options;

  switch (command) {
    case 'install':
      return install(debug);
    case 'update':
      return update(service, debug);
    case 'update-ingress':
      return updateIngress(debug);
  }
}

async function install(debug) {
  console.log('Starting local microservice deployment...');

  try {
    await checkRequirements();
    await setupCluster(debug);
    await deployServices(debug);
    await enableIngressController(debug);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

async function update(service, debug) {
  console.log('Starting local microservice deployment...');

  try {
    await checkRequirements();
    await deployService(service, debug);
  } catch (error) {
    console.log(error.message);
  }
}

async function updateIngress(debug) {
  console.log('Starting local microservice deployment...');

  try {
    await checkRequirements();
    await deployIngressController(debug);
  } catch (error) {
    console.log(error.message);
  }
}
