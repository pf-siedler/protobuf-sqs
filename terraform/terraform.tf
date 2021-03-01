provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_sqs_queue" "queue" {
  name = "example-queue"
}

# Queue の URL を出力する
output "queue_id" {
  value = aws_sqs_queue.queue.id
}
