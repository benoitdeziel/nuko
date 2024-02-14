export interface NestApplicationGeneratorSchema {
  applicationName: string;
  includeQueue?: boolean;
  includeRedis?: boolean;
  includeDatabase?: boolean;
}
