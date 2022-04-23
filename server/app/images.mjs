import fs from 'fs'
import crypto from 'crypto'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const imagesFolder = path.join(__dirname, '../../public/images')

const base64Pattern = /data:image\/(.+);base64,(.+)/

export function saveImage (image) {
  const name = crypto.randomBytes(8).toString('hex')
  const [_, ext, data] = base64Pattern.exec(image)
  const imagePath = path.join(imagesFolder, name + '.' + ext)
  fs.writeFile(imagePath, data, 'base64', function (err) {
    console.log(err)
  })
  return `/images/${name}.${ext}`
}
