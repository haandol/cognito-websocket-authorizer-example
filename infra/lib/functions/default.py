import json
import boto3

ws_client = None


def send_message(msg, conn_id):
    return ws_client.post_to_connection(
        Data=msg.encode('utf-8'),
        ConnectionId=conn_id,
    )


def handler(event, context):
    print(json.dumps(event))

    global ws_client

    request_context = event['requestContext']
    if not ws_client:
        endpoint_url = f"https://{request_context['domainName']}/{request_context['stage']}"
        ws_client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_url)

    connection_id = request_context['connectionId']
    body = json.loads(event['body'])
    body.update({'connection_id': connection_id})
    msg = json.dumps(body)
    print(send_message(msg, connection_id))

    return {
        'statusCode': 200,
        'body': 'Data Sent.',
    }