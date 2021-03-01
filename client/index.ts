import { IPurchase, Purchase } from "../generated";
import { SQS } from "aws-sdk";
import { DropUndefined } from "./types";

function main() {
    // 適当に環境変数を読み取るゾーン
    const region = process.env.AWS_REGION ?? "ap-northeast-1";
    const QueueUrl = process.env.QUEUE_URL;

    if (QueueUrl === undefined) {
        console.error("Please set env `QUEUE_URL`");
        process.exit(1);
    }

    const rawMessage: DropUndefined<IPurchase> = {
        productId: "abc",
        userId: "123",
        price: 123.4,
        timestamp: Math.round(new Date(0).getTime() / 1000),
    };

    // Protobuf.js の Message Class
    const message: Purchase = Purchase.create(rawMessage);
    // Protobuf の仕様に従って serialize されたバイト列
    const encoded: Uint8Array = Purchase.encode(message).finish();
    // バイト列を base64 でエンコードして文字列にしたもの
    const base64ed: string = Buffer.from(encoded).toString("base64");

    // SQS に積む処理
    new SQS({ region }).sendMessage(
        {
            MessageBody: base64ed,
            QueueUrl,
        },
        (err, data) => {
            console.error(err);
            console.log(data);
        },
    );
}

main();
