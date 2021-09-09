import json
import boto3

client = boto3.client('cognito-idp')

def handler(event, context):
    print('Received event:', json.dumps(event))

    token = event['headers']['Auth']
    res = client.get_user(AccessToken=token)
    username = res['Username']
    return generateAllow(username, event['methodArn'])


def generatePolicy(principalId, effect, resource):
    authResponse = {}
    authResponse['principalId'] = principalId
    if effect and resource:
        policyDocument = {}
        policyDocument['Version'] = '2012-10-17'
        policyDocument['Statement'] = []

        statementOne = {}
        statementOne['Action'] = 'execute-api:Invoke'
        statementOne['Effect'] = effect
        statementOne['Resource'] = resource
        policyDocument['Statement'].append(statementOne)

        authResponse['policyDocument'] = policyDocument
    return authResponse


def generateAllow(principalId, resource):
   return generatePolicy(principalId, 'Allow', resource)


def generateDeny(principalId, resource):
   return generatePolicy(principalId, 'Deny', resource)