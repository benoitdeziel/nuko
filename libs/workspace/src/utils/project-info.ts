import { Tree, readJson } from '@nx/devkit';

export function getProjectName(tree: Tree) {
  const packageJsonPath = 'package.json';
  if (!tree.exists(packageJsonPath)) {
    throw new Error('package.json not found at the root of the workspace.');
  }

  const packageJson = readJson(tree, packageJsonPath);
  return packageJson.name;
}
