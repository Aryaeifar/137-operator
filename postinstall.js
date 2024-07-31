'use strict'

const fs = require('fs');
const path = require('path')

// Prject root directory
const rootPath = process.env.INIT_CWD

if (!fs.existsSync('.env')) {
    fs.createReadStream(path.join(rootPath, '.env.example')).pipe(fs.createWriteStream(path.join(rootPath, '.env')));
}