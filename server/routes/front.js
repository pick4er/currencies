import fs from 'fs';

function getFront(ctx) {
  ctx.body = fs.createReadStream('public/index.html');
  ctx.status = 200
}

export default getFront
