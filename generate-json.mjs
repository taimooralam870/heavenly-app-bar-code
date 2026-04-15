import { plants } from './src/app/data/plants.js';
import fs from 'fs';

fs.writeFileSync('./src/app/data/plants.json', JSON.stringify(plants, null, 2));
console.log('Successfully created plants.json');
