import 'dotenv/config';
import { client } from './utils/db.js';
import './models/token.jsjs';
import './models/users.js';

await client.sync({ force: true });
