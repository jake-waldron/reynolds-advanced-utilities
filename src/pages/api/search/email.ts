import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const cors = Cors({
  methods: ["GET", "HEAD"],
  origin: [
    "https://amp.reynoldsam.com",
    "https://ram-bam-us-web-qa.azurewebsites.net",
  ],
});

type emailData = {
  searchTerm: string;
  apiResponse: {
    searchTerm: string;
    products: { name: string; partNum: string; score: number }[];
  };
  feedbackType: string;
  issue: string;
};

async function sendEmail(requestInfo: emailData) {
  const { searchTerm, apiResponse, feedbackType, issue } = requestInfo;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as nodemailer.TransportOptions);

  await transporter.sendMail({
    from: '"Search Feedback" <info@reynoldsadvancedutilities.com>', // sender address
    to: "jakewaldron+ram@gmail.com", // list of receivers
    subject: `${feedbackType} - "${searchTerm}"`, // Subject line
    text: `Feedback Type: ${feedbackType}\n\nIssue: ${issue}\n\nSearch Term: "${searchTerm}"\n\nAPI Response: ${JSON.stringify(
      apiResponse
    )}
    `,
  });
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

// next api handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  console.log("request!");

  if (req.method === "POST") {
    const requestInfo = req.body as emailData;

    try {
      console.log("sending email!");
      await sendEmail(requestInfo);
      console.log("email sent!");
      return res.status(200).json({ message: "email sent!" });
    } catch (error) {
      console.log("error sending email", error);
      return res.status(500).json({ error: "error sending email" });
    }
  }

  return res.status(400).json({ error: "invalid request" });
}
