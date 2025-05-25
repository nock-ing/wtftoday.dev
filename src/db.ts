import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:wtftoday.db');


export default db;