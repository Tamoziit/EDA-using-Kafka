import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import kafkaConfig from "../config/kafka.config";

const app = new Hono();

app.post('/create-post',
    zValidator("json", z.object({
        title: z.string(),
        content: z.string()
    })),

    async (c) => {
        const { title, content } = c.req.valid("json");

        try {
            //streaming post event to event stream
            await kafkaConfig.sendToTopic('post', JSON.stringify({ title, content }));
            return c.json({ message: 'Post created' }, 201);
        } catch (error) {
            console.log(error);
            return c.json({ error: 'Error in creating post' }, 500);
        }
    }
);

export default app;