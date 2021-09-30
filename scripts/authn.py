import boto3
import argparse
import traceback

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('--username',
                    type=str,
                    required=True,
                    help='email as username')
parser.add_argument('--password',
                    type=str,
                    required=True,
                    help='password')

client = boto3.client('cognito-idp')

# REPLACE below values
UserPoolId = 'ap-northeast-2_BPsX1i0k0'
ClientId = '7com6gd7rs8mbcgkk5358oea0k'


def create_user(username: str):
    try:
        return client.admin_create_user(
            UserPoolId=UserPoolId,
            Username=username,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': username,
                },
            ],
            ForceAliasCreation=False,
            MessageAction='SUPPRESS',
            DesiredDeliveryMediums=['EMAIL'],
        )
    except:
        traceback.print_exc()
        pass


def reset_password(username: str, password: str):
    return client.admin_set_user_password(
        UserPoolId=UserPoolId,
        Username=username,
        Password=password,
        Permanent=True,
    )


def initiate_auth(username: str, password: str):
    return client.initiate_auth(
        AuthFlow='USER_PASSWORD_AUTH',
        AuthParameters={
            'USERNAME': username,
            'PASSWORD': password,
        },
        ClientId=ClientId,
    )



if '__main__' == __name__:
    args = parser.parse_args()
    username = args.username
    password = args.password

    create_user(username)
    reset_password(username, password)
    res = initiate_auth(username, password)
    token = res['AuthenticationResult']['AccessToken']
    print(token)