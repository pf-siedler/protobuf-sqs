import { SQS } from "aws-sdk";
import { Purchase } from "../generated";

async function main() {
    const QueueUrl = process.env.QUEUE_URL;
    if (QueueUrl === undefined) {
        console.error("Please set env `QUEUE_URL`");
        process.exit(1);
    }
    const region = process.env.AWS_REGION ?? "ap-northeast-1";

    const sqsInstance = new SQS({
        region,
    });

    // SQS からメッセージを取り出す
    const sqsResult = await sqsInstance
        .receiveMessage({
            QueueUrl,
        })
        .promise();
    if (sqsResult.Messages === undefined || sqsResult.Messages.length === 0) {
        console.log("no messages found");
        process.exit(0);
    }

    // base64 string から Protobuf.js の Message Class を生成する
    const getMessage = (base64String: string): Purchase => {
        // Protobuf の仕様に従って serialize されたバイト列
        const serialized = Uint8Array.from(Buffer.from(base64String, "base64"));
        // Protobuf.js の Message Class
        return Purchase.decode(serialized);
    };
    const messages = sqsResult.Messages.map(m => m.Body)
        .filter(<T>(x: T | undefined): x is T => x !== undefined)
        .map(str => getMessage(str));

    // 各 message について、何らかの処理を行う
    // 今回は console.log に適当に文を吐くだけ
    messages.forEach(message => {
        // `message.userId` 等でプロパティにアクセスできる
        const userId = message.userId;
        // 型も付く Protobuf で `uint32 timestamp = 3;` と定義したので、`message.timestamp` は number 型
        const date = new Date(message.timestamp);

        // ただし、 Message をネストすると型が正しく付かない
        // message.items[n].price は `number | null | undefined`
        const sumPrice = message.items.reduce(
            (sum, i) => sum + (i.price ?? 0),
            0,
        );

        console.log(
            `ユーザー（${userId}）が ${date.toLocaleDateString()} に合計 ${Math.floor(
                sumPrice,
            )}円の買い物をしました`,
        );
    });

    // 取得したメッセージを消す
    await sqsInstance
        .deleteMessageBatch({
            QueueUrl,
            Entries: sqsResult.Messages.map(m => ({
                Id: m.MessageId!,
                ReceiptHandle: m.ReceiptHandle!,
            })),
        })
        .promise();
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .then(() => {
        console.log("finished");
        process.exit(0);
    });
