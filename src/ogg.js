import axios from "axios"
import { createWriteStream } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverter {
    constructor() { }
    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input))
        } catch (error) {
            console.log('Error while creating mp3', error.message);
        }
     }
    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream'
            })
            return new Promise(resolve => {
                const srteam = createWriteStream(oggPath)
                response.data.pipe(srteam)
                srteam.on('finish', () => resolve(oggPath))
            })

        } catch (e) {
            console.log('Error while creating ogg', e.message)
        }

    }

}

export const ogg = new OggConverter()