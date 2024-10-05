import kafkaConfig from "./config/kafka.config";

export const init = async () => {
    try {
        await kafkaConfig.connect();
        await kafkaConfig.createTopic('post');
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message);
        else
            console.log("An unknown error occured in start.services.ts");
        process.exit(1);
    }
}