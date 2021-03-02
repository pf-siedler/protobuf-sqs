import { IPurchase, Purchase } from "../generated";
import { SQS } from "aws-sdk";
import { DropUndefined } from "./types";

async function main(): Promise<void> {
    const QueueUrl = process.env.QUEUE_URL;
    if (QueueUrl === undefined) {
        console.error("Please set env `QUEUE_URL`");
        process.exit(1);
    }
    const region = process.env.AWS_REGION ?? "ap-northeast-1";

    // TS の object
    const rawMessage: DropUndefined<IPurchase> = {
        userId: "hoge",
        items: [{ productId: "fuga", price: 123.4 }],
        timestamp: new Date(0).valueOf(),
    };

    // Protobuf.js が生成した Class
    const message: Purchase = Purchase.create(rawMessage);

    // serialize されたバイト列
    const serialized: Uint8Array = Purchase.encode(message).finish();

    // バイト列を base64 でエンコードして文字列にしたもの
    const base64String: string = Buffer.from(serialized).toString("base64");

    // SQS に積む処理
    await new SQS({ region })
        .sendMessage({
            MessageBody: base64String,
            QueueUrl,
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
