import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations'

interface RouteProps {
  api: apigwv2.IWebSocketApi
  routeId: string
  key: string
  handler: lambda.IFunction
}

export abstract class BaseApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }

  protected addRoute(props: RouteProps) {
    const integration = new integrations.LambdaWebSocketIntegration({ handler: props.handler })
    new apigwv2.WebSocketRoute(this, `${props.routeId}Route`, {
      webSocketApi: props.api,
      routeKey: props.key,
      integration,
    })
  }
}