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
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@reynoldsadvancedutilities.com",
      pass: "w#vGst4b",
    },
  });

  await transporter.sendMail({
    from: '"Info" <info@reynoldsadvancedutilities.com>', // sender address
    to: "jakewaldron+ram@gmail.com", // list of receivers
    subject: feedbackType, // Subject line
    text: `Feedback Type: ${feedbackType}\n\nSearch Term: "${searchTerm}"\n\nIssue: ${issue}\n\nAPI Response: ${JSON.stringify(
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

  if (req.method === "POST") {
    const requestInfo = req.body as emailData;

    await sendEmail(requestInfo);
    return res.status(200).json({ message: "email sent!" });
  }

  return res.status(400).json({ error: "invalid request" });
}
