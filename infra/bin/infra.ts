#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AuthStack } from '../lib/stacks/auth-stack'
import { ApiGatewayStack } from '../lib/stacks/apigateway-stack'
import { App } from '../lib/interfaces/config'

const ns = App.Context.ns
const app = new cdk.App({ context: App.Context })

const authStack = new AuthStack(app, `${ns}AuthStack`)

const apiGatewayStack = new ApiGatewayStack(app, `${ns}ApiGatewayStack`)
apiGatewayStack.addDependency(authStack)