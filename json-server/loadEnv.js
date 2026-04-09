const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf-8');

    raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .forEach((line) => {
            const separatorIndex = line.indexOf('=');

            if (separatorIndex <= 0) {
                return;
            }

            const key = line.slice(0, separatorIndex).trim();
            const value = line.slice(separatorIndex + 1).trim();

            if (!process.env[key]) {
                process.env[key] = value;
            }
        });
}
