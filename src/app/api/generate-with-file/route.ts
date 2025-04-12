import {GoogleGenerativeAI} from '@google/generative-ai';
import formidable from 'formidable';
import fs from 'fs';
import {NextRequest, NextResponse} from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY ?? '');
const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash'});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextRequest): Promise<{fields: formidable.Fields; files: formidable.Files}> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err ) {
        reject(err);
        return;
      }
      resolve({fields, files});
    });
  });
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const {fields, files} = await parseForm(req);

    const uploadedFileArray = files.file;

    if (!uploadedFileArray || !Array.isArray(uploadedFileArray) || uploadedFileArray.length ===0) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    const uploadedFile = uploadedFileArray[0] as formidable.File;

    if (!uploadedFile) {
         return NextResponse.json({ message: 'File data is missing.' }, { status: 400 });
    }

    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    const base64Data = fileBuffer.toString('base64');
    const mimeType = uploadedFile.mimetype ?? 'image/jpeg';

     if (!mimeType) {
         return NextResponse.json({ message: 'Could not determine file MIME type.' }, { status: 400 });
    }

    const prompt = 'Describe this image.';
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
  
    fs.unlinkSync(uploadedFile.filepath);

    return NextResponse.json({text}, {status: 200});
  } catch (error: any) {
    console.error('Error processing file in API:', error);
    return NextResponse.json(
      {message: 'Internal Server Error processing file', error: error.message},
      {status: 500}
    );
  }
}
