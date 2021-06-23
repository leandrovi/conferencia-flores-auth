import type { Serverless } from "serverless/aws";

const config: Serverless = {
  frameworkVersion: "2",
  service: "conferencia-flores-auth",
  plugins: ["serverless-webpack", "serverless-offline"],
  disabledDeprecations: [
    "PROVIDER_IAM_SETTINGS",
    "NEW_VARIABLES_RESOLVER",
    "CLI_OPTIONS_SCHEMA",
  ],

  custom: {
    stage: '${opt:stage, "dev"}',
    webpack: {
      packager: "yarn",
      webpackConfig: "./webpack.config.js",
      individually: true,
      includeModules: true,
    },
  },

  provider: {
    lambdaHashingVersion: 20201221,
    name: "aws",
    region: "us-east-1",
    runtime: "nodejs14.x",
    timeout: 10,
    memorySize: 512,
    logRetentionInDays: 30,
    stage: "${self:custom.stage}",
    stackName: "${self:service}-${self:custom.stage}",
    stackTags: {
      STACK: "${self:service}",
      STAGE: "${self:custom.stage}",
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    deploymentBucket: {
      name: "adai-serverless",
      blockPublicAccess: true,
    },
    iam: {},
    environment: {},
  },
};

export default config;
