export interface LocalDeploymentExecutorSchema {
  command: 'install' | 'update' | 'update-ingress';
  debug?: boolean;
  service?: string;
}
