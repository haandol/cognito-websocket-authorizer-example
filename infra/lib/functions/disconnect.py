import json

def handler(event, context):
    print(json.dumps(event))

    return {
        'stausCode': 200,
        'body': 'Disconnected',
    }