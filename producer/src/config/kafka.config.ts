import { Admin, Kafka, logLevel, Producer } from "kafkajs";

class KafkaConfig {
    private kafka: Kafka;
    private producer: Producer;
    private admin: Admin;
    private brokers: string;

    constructor() {
        /* Initializations */
        this.brokers = process.env.KAFKA_BROKERS || '192.168.210.234:9092';
        this.kafka = new Kafka({
            clientId: 'producer',
            brokers: [this.brokers],
            logLevel: logLevel.ERROR
        });
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin();
    }

    //to establish connection b/w Kafka & server
    async connect(): Promise<void> {
        try {
            await this.producer.connect();
            await this.admin.connect();
            console.log("Kafka connected");
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while trying to connect Kafka");
        }
    }

    //Topic creation
    async createTopic(topic: string): Promise<void> {
        try {
            await this.admin.createTopics({
                topics: [{ topic, numPartitions: 1 }]
            });
            console.log('Topic created: ', topic);
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while trying to create a Topic");
        }
    }

    //assigning/streaming event to topic
    async sendToTopic(topic: string, message: string): Promise<void> {
        try {
            await this.producer.send({
                topic,
                messages: [{ value: message }]
            })
            console.log("Message sent to topic: ", topic)
        } catch (error) {
            if (error instanceof Error)
                console.log(error.message);
            else
                console.log("An unknown error occured while trying to send message to topic");
        }
    }

    //disconnecting Kafka streams
    async disconnect(): Promise<void> {
        try {
            await this.producer.disconnect();
            await this.admin.disconnect();
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