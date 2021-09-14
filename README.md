# Wbsocket API with authentication via Cognito

This repository is about example code for API Gateway Websocket with Cognito authenticator

**Running this repository may cost you to provision AWS resources**

# Prerequisites

- awscli
- Nodejs 14
- Python 3.8
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ cd infra
$ npm i
```

Install cdk in global context and run `cdk init` if you did not initailize cdk yet.

```bash
$ npm i -g cdk@1.122.0
$ cdk bootstrap
```

Deploy CDK Stacks on AWS

```bash
$ cdk deploy "*" --require-approval never
```

Visit API Gateway console page and copy WebsocketURL And Install wscat

```bash
$ npm i -g wscat
```

# Usage

1. make sure trying to connect Websocket API failes because of the request is unauthenticated

```bash
$ wscat -c wss://xxx
```

2. create test account on Cognito

```bash
$ pip install -r scripts/requirements.txt
$ python script/cognito.py
{ access_token: xxx }
```

copy access_token to your clipboard

3. connect to Websocket with `Auth` header

```bash
$ wscat -c wss://xxx --header Auth:[your_access_token]
```


# Cleanup

destroy provisioned cloud resources

```bash
$ cdk destroy "*"
```