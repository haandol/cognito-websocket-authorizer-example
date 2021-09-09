import * as cdk from '@aws-cdk/core'
import * as apigw from '@aws-cdk/aws-apigateway'
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2'
import { WsApi } from '../constructs/wsapi'

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigwv2.IWebSocketApi
  public readonly requestAuthorizerId: string

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const wsApi = new WsApi(this, `WebsocketApi`)
    this.api = wsApi.api
  }

}
