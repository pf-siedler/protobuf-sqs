import { SQS } from "aws-sdk";
import { Purchase } from "../generated";

function main() {
    // 適当に環境変数を読み取るゾーン
    const region = process.env.AWS_REGION ?? "ap-northeast-1";
    const QueueUrl = process.env.QUEUE_URL;

    if (QueueUrl === undefined) {
        console.error("Please set env `QUEUE_URL`");
        process.exit(1);
    }

    const sqs = new SQS({ region });
    // SQS からメッセージを pop する
    // 今回は第2引数に cb を渡す方法で書いたが、 `sqs.receiveMessage({ QueueUrl }).promise()` で async/await 使う方が書きやすい
    sqs.receiveMessage({ QueueUrl }, (err, data) => {
        console.error(err);
        // バイト列を base64 でエンコードして文字列にしたもの
        const base64ed = data.Messages![0].Body;
        if (base64ed === undefined) {
            console.error("failed to receive message");
            process.exit(1);
        }
        // Protobuf の仕様に従って serialize されたバイト列
        const encoded = Uint8Array.from(Buffer.from(base64ed, "base64"));
        // Protobuf.js の Message Class
        const message = Purchase.decode(encoded);

        // `message.productId` や `message.price` 等で各プロパティにアクセスできる
        // 型もちゃんと付いている

        // 雑に JSON に変換して標準出力に吐く
        console.log(JSON.stringify(message.toJSON()));
    });
}

main();
