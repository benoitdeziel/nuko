import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function setupCluster(debugEnabled: boolean) {
  const namespace = 'default';

  try {
    console.log('Deleting old cluster...');
    await execAsync('minikube delete');
    console.log('Cluster deleted ✅');

    console.log('Setting up fresh cluster...');
    await execAsync('minikube start');
    console.log('Cluster created ✅');

    console.log('Creating/Checking namespace...');
    await setupNamespace(namespace);

    console.log('Setting up helm repositories...');
    await execAsync('helm repo add datadog https://helm.datadoghq.com');
    await execAsync('helm repo add bitnami https://charts.bitnami.com/bitnami');
    await execAsync('helm repo update');

    console.log('Starting RabbitMQ...');
    await execAsync(
      `helm install rabbitmq --namespace ${namespace} -f infrastructure/local/rabbitmq-values.yml bitnami/rabbitmq`,
    );
    console.log('RabbitMQ Started ✅');

    console.log('Starting PostgreSQL...');
    await execAsync(
      `helm install postgresql --namespace ${namespace} -f infrastructure/local/postgresql-values.yml bitnami/postgresql`,
    );
    console.log('PostgreSQL Started ✅');

    console.log('Starting Redis...');
    await execAsync(
      `helm install redis --namespace ${namespace} -f infrastructure/local/redis-values.yml bitnami/redis`,
    );
    console.log('Redis Started ✅');
  } catch (error) {
    if (debugEnabled) {
      console.error(error);
    }
    throw new Error('Issue while setting up cluster, is your docker running?');
  }
}

async function setupNamespace(namespace) {
  try {
    const { stdout, stderr } = await execAsync(
      `kubectl get namespace ${namespace}`,
    );
    if (stderr) {
      console.error('Error checking namespace:', stderr);
      await execAsync(`kubectl create namespace ${namespace}`);
      console.log(`Namespace "${namespace}" created ✅`);
    }
  } catch (error) {
    await execAsync(`kubectl create namespace ${namespace}`);
    console.log(`Namespace "${namespace}" created ✅`);
  }
}
