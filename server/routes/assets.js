import fs from 'fs';
import mime from 'mime/lite';

function getMime(filename) {
  return mime.getType(filename) || 'text/plain';
}

function getAsset(ctx) {
  ctx.set({ 'Content-Type': getMime(ctx.filename) })
  ctx.body = fs.createReadStream(`build/${ctx.filename}`);
  ctx.status = 200
}

export default getAsset
