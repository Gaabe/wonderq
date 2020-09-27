import * as express from "express";
import * as bodyParser from "body-parser";
import * as queueRoutes from "./queueRoutes";
import * as swaggerJsDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";

const app = express();

const swaggerDocs = swaggerJsDoc({
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "WonderQ API",
      description: "API for interacting with the WonderQ service",
      servers: ["http://localhost:3000"],
    },
  },
  apis: [__filename],
});
app.use("/api-reference", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /send-message:
 *  post:
 *     parameters:
 *       - name: messageData
 *         description: Message data object
 *         in:  body
 *         required: true
 *         type: any
 *         example:
 *           messageData: "sample message text"
 *     description: Use to send a message to the queue service, this will add the message to the queue for later processing
 *     responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: string
 *          example: "f730cacf-6b89-469a-9a29-eff110715fe7"
 *
 */
app.post("/send-message", bodyParser.json(), queueRoutes.sendMessage);

/**
 * @swagger
 * /get-message:
 *  get:
 *     description: Use to get a message that is queued in the service
 *     responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            data:
 *              type: any
 *
 */
app.get("/get-message/", bodyParser.json(), queueRoutes.getMessage);

/**
 * @swagger
 * /process-message:
 *  post:
 *     parameters:
 *       - name: messageId
 *         description: Message id
 *         in:  body
 *         required: true
 *         type: string
 *         example:
 *           messageId: "f730cacf-6b89-469a-9a29-eff110715fe7"
 *     description: Use to inform the service that the message has been processed
 *     responses:
 *      '200':
 *        description: A successful response
 *
 */
app.post("/process-message/", bodyParser.json(), queueRoutes.processMessage);

export default app;
