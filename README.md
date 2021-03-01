# Protobuf on SQS

An example using Protobuf as a schema definition for message queueing service

## Dependencies

- node
- terraform
- aws-cli

## Usege

You need AWS Access Key and Secret with `AmazonSQSFullAccess` policy.

### Configure aws-cli

```sh
aws configure

# AWS Access Key ID: xxxxxxxxxx
# AWS Secret Access Key: xxxxxxxxxx
```

### Create Amazon SQS Queue

```sh
cd terraform
terraform init
terraform apply

# => queue_id = "https://sqs.ap-northeast-1.amazonaws.com/xxxxxxxxxx/example-queue"

export QUEUE_URL=https://sqs.ap-northeast-1.amazonaws.com/xxxxxxxxxx/example-queue
```

### Codegen with `Protobuf.js`

```sh
yarn protogen
```

### Enqueue message

```sh
yarn ts-node client
```

### Dequeue message

```sh
yarn ts-node consumer
```
