import { connectDB } from "./config/db.config";
import kafkaConfig from "./config/kafka.config";
import { postConsumer } from "./services/post.consumer";

export const init = async () => {
    try {
        await connectDB();
        await kafkaConfig.connect();
        await postConsumer();
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occured in start.services.ts");
        }
        process.exit(1);
    }
}