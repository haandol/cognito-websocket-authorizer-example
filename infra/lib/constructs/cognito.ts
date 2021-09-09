import * as cdk from '@aws-cdk/core'
import * as cognito from '@aws-cdk/aws-cognito'
import { App, IdentityProvider } from '../interfaces/config'

export class CognitoUserPool extends cdk.Construct {
  public readonly userPool: cognito.IUserPool
  public readonly userPoolClient: cognito.IUserPoolClient

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    this.userPool = this.createUserPool()
    this.userPoolClient = this.createUserPoolClient(this.userPool)
  }

  private createUserPool() {
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: `${App.Context.ns}UserPool`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true },
      },
      customAttributes: {
        agreeToPolicy: new cognito.BooleanAttribute({ mutable: true }),
      },
      passwordPolicy: {
        requireDigits: true,
        requireSymbols: false,
        requireLowercase: true,
        requireUppercase: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    })
    new cognito.UserPoolDomain(this, `UserPoolDomain`, {
      userPool,
      cognitoDomain: {
        domainPrefix: `${App.Context.ns.toLowerCase()}${cdk.Stack.of(this).account}`,
      },
    })
    return userPool
  }

  private createUserPoolClient(userPool: cognito.IUserPool): cognito.IUserPoolClient {
    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPoolClientName: `${App.Context.ns}UserPoolClient`,
      userPool,
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
      },
      oAuth: {
        flows: {
          implicitCodeGrant: true,
        },
        callbackUrls: [IdentityProvider.RedirectUri],
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
          cognito.OAuthScope.OPENID,
        ],
      },
      preventUserExistenceErrors: true,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    })
    return userPoolClient
  }

}