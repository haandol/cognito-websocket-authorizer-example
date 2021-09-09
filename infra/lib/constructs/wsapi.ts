import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as lambda from '@aws-cdk/aws-lambda'
import * as lambdaPython from '@aws-cdk/aws-lambda-python'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations'
import { App } from '../interfaces/config'

interface IApiIntegration {
  connIntegration: apigwv2.IWebSocketRouteIntegration
  disconnIntegration: apigwv2.IWebSocketRouteIntegration
  defaultIntegration: apigwv2.IWebSocketRouteIntegration
}

export class WsApi extends cdk.Construct {
  public readonly api: apigwv2.WebSocketApi

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    const baseIntegrations = this.createBaseIntegrations()
    this.api = this.createWebSocketApi(baseIntegrations)
    this.createAuthorizer(this.api)
  }

  private createWebSocketApi(props: IApiIntegration): apigwv2.WebSocketApi {
    const api = new apigwv2.WebSocketApi(this, 'WebsocketApi', {
      apiName: `${App.Context.ns}WebsocketApi`,
      routeSelectionExpression: '$request.body.action',
      connectRouteOptions: {
        integration: props.connIntegration,
      },
      disconnectRouteOptions: {
        integration: props.disconnIntegration,
      },
      defaultRouteOptions: {
        integration: props.defaultIntegration,
      },
    })

    const devStage = new apigwv2.CfnStage(this, `Prod`, {
      apiId: api.apiId,
      stageName: 'prod',
      autoDeploy: true,
      defaultRouteSettings: {
        dataTraceEnabled: true,
        loggingLevel: 'INFO',
      },
    });
    new cdk.CfnOutput(this, `WebsocketApiUrl`, {
      exportName: `${App.Context.ns}WebsocketApiUrl`,
      value: `${api.apiEndpoint}/${devStage.stageName}`,
    })

    return api
  }

  private createAuthorizer(api: apigwv2.IWebSocketApi) {
    const handler = new lambdaPython.PythonFunction(this, `AuthHandler`, {
      functionName: `${App.Context.ns}AuthHandler`,
      entry: path.resolve(__dirname, '..', 'functions'),
      index: 'authorizer.py',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    handler.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'))
    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:Get*',
      ],
      resources: ['*'],
    }))

    new apigwv2.CfnAuthorizer(this, `RequestAuthorizer`, {
      apiId: api.apiId,
      authorizerType: 'REQUEST',
      name: `${App.Context.ns}Authorizer`,
      authorizerUri: `arn:aws:apigateway:${cdk.Stack.of(this).region}:lambda:path/2015-03-31/functions/${handler.functionArn}/invocations`,
      identitySource: ['route.request.header.Auth'],
    })
  }

  private createBaseIntegrations() {
    const connFunction = new lambdaPython.PythonFunction(this, `ConnFunction`, {
      functionName: `${App.Context.ns}ConnFunction`,
      entry: path.resolve(__dirname, '..', 'functions'),
      index: 'connect.py',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    connFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'execute-api:Invoke',
        'execute-api:ManageConnections',
      ],
      resources: ['*'],
    }))
    const connIntegration = new integrations.LambdaWebSocketIntegration({
      handler: connFunction
    })
    const disconnFunction = new lambdaPython.PythonFunction(this, `DisconnFunction`, {
      functionName: `${App.Context.ns}DisconnFunction`,
      entry: path.resolve(__dirname, '..', 'functions'),
      index: 'disconnect.py',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    disconnFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'execute-api:Invoke',
        'execute-api:ManageConnections',
      ],
      resources: ['*'],
    }))
    const disconnIntegration = new integrations.LambdaWebSocketIntegration({
      handler: disconnFunction
    })

    const defaultFunction = new lambdaPython.PythonFunction(this, `DefaultFunction`, {
      functionName: `${App.Context.ns}DefaultFunction`,
      entry: path.resolve(__dirname, '..', 'functions'),
      index: 'default.py',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    defaultFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'execute-api:Invoke',
        'execute-api:ManageConnections',
      ],
      resources: ['*'],
    }))
    const defaultIntegration = new integrations.LambdaWebSocketIntegration({
      handler: defaultFunction
    })

    return {
      connIntegration,
      disconnIntegration,
      defaultIntegration,
    }
  }

}
