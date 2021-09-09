export namespace App {
  const Namespace = 'CogReqAuthDemo'

  enum DeployStage {
    DEV = 'Dev',
    PROD = 'Prod',
  }
  const Stage = DeployStage.DEV

  export const Context = {
    ns: Namespace,
    stage: Stage,
  }
}

export namespace IdentityProvider {
  export const RedirectUri = 'http://localhost:3000'
}

export namespace Tables {
  export const ReadWriteActions = [
    'dynamodb:BatchGetItem',
    'dynamodb:GetItem',
    'dynamodb:GetRecords',
    'dynamodb:GetShardIterator',
    'dynamodb:Query',
    'dynamodb:Scan',
    'dynamodb:BatchWriteItem',
    'dynamodb:DeleteItem',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
  ]

  export const Name = {
    Main: `${App.Context.ns}Main`,
  }
}