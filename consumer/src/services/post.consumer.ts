import kafkaConfig from "../config/kafka.config";
import PostModel from "../models/post.model";

export const postConsumer = async () => {
    const messages: any[] = []; //event Queue
    let processing = false;

    try {
        await kafkaConfig.subscribeToTopic("post");
        await kafkaConfig.consume(async (message) => {
            messages.push(message);
            console.log("Message received", message);

            if (messages.length > 100) {
                //batch insertion
                processMessages();
            }
        });

        setInterval(processMessages, 5000); //run every 5 secs interval
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("An unknown error occurred in consumer func.");
        }
    }

    //Bulk insertion
    async function processMessages() {
        if (messages.length > 0 && !processing) {
            processing = true;
            const batchToProcess = [...messages];
            messages.length = 0;

            try {
                await PostModel.insertMany(batchToProcess, { ordered: false });
                console.log("Bulk Insertion completed");
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    console.log("An unknown error occurred in batch Processing");
                }
                messages.push(...batchToProcess); //if error, the messages put back to queue
            } finally {
                processing = false;
            }
        }
    }
}
