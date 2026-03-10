import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
}

const filePaths = [
    'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/tiny_face_detector_model-weights_manifest.json',
    'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/tiny_face_detector_model.weights.bin',
    'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/face_expression_model-weights_manifest.json',
    'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/face_expression_model.weights.bin'
];

filePaths.forEach(url => {
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const destPath = path.join(modelsDir, fileName);

    const fileStream = fs.createWriteStream(destPath);
    https.get(url, (response) => {
        if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                https.get(response.headers.location, (res) => {
                    res.pipe(fileStream);
                    fileStream.on('finish', () => {
                        fileStream.close();
                        console.log(`Downloaded ${fileName}`);
                    });
                });
            } else {
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded ${fileName}`);
                });
            }
        } else {
            console.error(`Failed to download ${fileName}: ${response.statusCode}`);
            fs.unlinkSync(destPath);
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${fileName}: ${err.message}`);
        fs.unlinkSync(destPath);
    });
});
