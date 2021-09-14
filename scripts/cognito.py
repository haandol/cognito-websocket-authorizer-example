import boto3

client = boto3.client('cognito-idp')

Username = 'test@example.com'
Password = 'q1w2e3r4'

# REPLACE below values
UserPoolId = 'ap-northeast-2_9eMHzsovg'
ClientId = '7tgk6jks8gmu28ig825h4f20e9'


try:
    res = client.admin_create_user(
        UserPoolId=UserPoolId,
        Username=Username,
        UserAttributes=[
            {
                'Name': 'email',
                'Value': Username,
            },
        ],
        TemporaryPassword=Password,
        ForceAliasCreation=False,
        MessageAction='SUPPRESS',
        DesiredDeliveryMediums=['EMAIL'],
    )
except:
    pass

res = client.admin_set_user_password(
    UserPoolId=UserPoolId,
    Username=Username,
    Password=Password,
    Permanent=True,
)

res = client.initiate_auth(
    AuthFlow='USER_PASSWORD_AUTH',
    AuthParameters={
        'USERNAME': Username,
        'PASSWORD': Password,
    },
    ClientId=ClientId,
)

token = res['AuthenticationResult']['AccessToken']
print(token)
