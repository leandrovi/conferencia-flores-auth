import { Request, Response } from "express";
import * as AWS from "aws-sdk";

import attendees from "../../../attendees.json";

AWS.config.update({ region: "us-east-1" });

interface IAttendee {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class LoginController {
  async login(request: Request, response: Response) {
    console.info("Login");
    return response.status(200).json({ ok: true });
  }

  async seed(request: Request, response: Response) {
    if (process.env.NODE_ENV !== "development") return response.status(202);

    console.info("🚀 Starting database seed:", JSON.stringify(attendees));

    const dynamo = new AWS.DynamoDB.DocumentClient();
    const chuncks: IAttendee[][] = [];
    const size = 25;

    while (attendees.length > 0) {
      chuncks.push(attendees.splice(0, size));
    }

    const unprocessed = [];
    const errors = [];

    try {
      for (let chunck of chuncks) {
        const requests: AWS.DynamoDB.DocumentClient.WriteRequest[] = chunck.map(
          (item) => ({
            PutRequest: { Item: item },
          })
        );

        const requestItems: AWS.DynamoDB.DocumentClient.BatchWriteItemRequestMap =
          {
            [process.env.ATTENDEES_TABLE]: requests,
          };

        const params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
          RequestItems: requestItems,
        };

        const output = await dynamo.batchWrite(params).promise();

        unprocessed.push(output.UnprocessedItems);
        errors.push(output.$response.error);
      }

      if (unprocessed.length > 0) {
        console.error("❌ Some items could not be processed:", {
          lenght: unprocessed.length,
          items: unprocessed,
        });
      }

      if (errors.length > 0) {
        console.error(
          "❌ Some errors happened when processing the batch:",
          errors
        );
      }

      console.info("✅ Database seed has successfully completed");

      return response
        .status(202)
        .json({ message: "Attendees succesfully processed" });
    } catch (err) {
      console.error("❌ Could not complete batch write:", err);
      return response
        .status(500)
        .json({ error: "Could not process attendees creation" });
    }
  }
}
