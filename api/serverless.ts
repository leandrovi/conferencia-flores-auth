import sls from "./serverless.default";

sls.custom.attendeesTable = {
  dev: "flowers-attendees-dev",
  prod: "flowers-attendees-prod",
};

sls.provider.apiGateway = {
  shouldStartNameWithService: true,
};

sls.provider.environment = {
  STAGE: "${self:custom.stage}",
  NODE_OPTIONS: "--enable-source-maps",
  AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1,
  ATTENDEES_TABLE: "${self:custom.attendeesTable.${self:provider.stage}}",
};

sls.provider.iam.role = {
  statements: [
    {
      Effect: "Allow",
      Action: [
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
      ],
      Resource: [
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.ATTENDEES_TABLE}",
      ],
    },
  ],
};

sls.functions = {
  default: {
    handler: "src/handler.default",
    events: [
      {
        http: { method: "get", path: "/login", cors: true },
      },
    ],
  },
};

module.exports = sls;
