import { Consumer, Kafka, logLevel } from "kafkajs";

class KafkaConfig {
    private kafka: Kafka;
    private consumer: Consumer;
    private brokers: string;

    constructor() {
        /* Initializations */
        this.brokers = process.env.KAFKA_BROKERS || '192.168.210.234:9092';
        this.kafka = new Kafka({
            clientId: 'consumer',
            brokers: [this.brokers],
            logLevel: logLevel.ERROR
        });
        this.consumer = this.kafka.consumer({
            groupId: "consumer"
        });
    }

    //to establish connection b/w Kafka & server
    async connect(): Promise<void> {
        try {
            await this.consumer.connect();
            console.log("Kafka connected");
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while trying to connect Kafka");
        }
    }

    //Service subscribing to topic
    async subscribeToTopic(topic: string): Promise<void> {
        try {
            await this.consumer.subscribe({
                topic,
                fromBeginning: true
            });
            console.log("Subscribed to topic:", topic);
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while subscribing to topic");
        }
    }

    //Consumer method
    async consume(callback: (message: any) => void): Promise<void> {
        try {
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const messageValue = message?.value?.toString();

                    if (messageValue) {
                        callback(JSON.parse(messageValue));
                    } else {
                        console.log("Message value is undefined");
                    }
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log("An unknown error occurred in Consuming event");
            }
        }
    }


    //disconnecting Kafka streams
    async disconnect(): Promise<void> {
        try {
            await this.consumer.disconnect();
            console.log("Kafka disconnected");
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while trying to disconnect Kafka");
        }
    }
}

export default new KafkaConfig();