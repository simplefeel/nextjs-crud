import { createWriteStream } from 'fs';
import axios from 'axios';
import { createHash } from 'crypto';
import { extname } from 'path';

export function generateFilename(remoteUrl: string) {
  const hash = createHash('md5').update(remoteUrl).digest('hex');
  const extension = extname(remoteUrl);
  const filename = hash + extension;
  return filename;
}

export async function downloadFile(fileUrl: string, localPath: string) {
  const fileStream = createWriteStream(localPath);
  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });
    response.data.pipe(fileStream);
  } catch (error) {
    throw new Error(`Failed to download file: ${error}`);
  }
}
