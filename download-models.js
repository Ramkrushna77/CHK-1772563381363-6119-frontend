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

// These are known working raw links for face-api.js weights from a reliable mirror
// Specifically the face_expression_model.weights.bin should be ~710KB
const baseUrl = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model';
const files = [
    'tiny_face_detector_model-weights_manifest.json',
    'tiny_face_detector_model.weights.bin',
    'face_expression_model-weights_manifest.json',
    'face_expression_model.weights.bin'
];

async function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting model downloads from vladmandic mirror...');
    for (const file of files) {
        const url = `${baseUrl}/${file}`;
        const dest = path.join(modelsDir, file);
        try {
            console.log(`Downloading ${file}...`);
            await downloadFile(url, dest);
            const stats = fs.statSync(dest);
            console.log(`Success: ${file} (${stats.size} bytes)`);
        } catch (err) {
            console.error(`Error downloading ${file}: ${err.message}`);
        }
    }
    console.log('Download process finished.');
}

main();
