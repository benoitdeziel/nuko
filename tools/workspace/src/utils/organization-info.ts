import { Tree, readJson } from '@nx/devkit';

export function getOrganizationName(tree: Tree) {
  const packageJsonPath = 'package.json';
  if (!tree.exists(packageJsonPath)) {
    throw new Error('package.json not found at the root of the workspace.');
  }

  const packageJson = readJson(tree, packageJsonPath);
  return extractOrgName(packageJson.name);
}

function extractOrgName(input: string): string {
  const regex = /@(\w+)\//;
  const match = input.match(regex);
  return match[1];
}
