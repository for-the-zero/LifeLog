/*
GUIDE:
先去AppModels表在File（nvarchar）找文件路径，获取这一条数据的ID（INTEGER）值
再去DailyLogModels表中少选出所有的Date（datetime）为这一天（里面的数据全是00:00:00）且AppModelID（INT）为上一步获取ID值的项
把所有的项的Time（INT）值全部加起来
*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('./config.json');
const db_path = config.tai;


function get_time(filePath) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(db_path, sqlite3.OPEN_READONLY, (err) => {
            if (err) {return reject(err)};
        });
        // 2. 先根据文件路径查出 AppModels 的 ID
        const queryApp = 'SELECT ID FROM AppModels WHERE File = ? LIMIT 1';
        db.get(queryApp, [filePath], (err, row) => {
            if (err) {
                db.close();
                return reject(err);
            }
            if (!row) {
                db.close();
                return resolve(0);
            }
            const appId = row.ID;
            const todayStr = new Date().toISOString().slice(0, 10);
            const queryDaily = `
                SELECT SUM(Time) AS total
                FROM DailyLogModels
                WHERE DATE(Date) = DATE(?)
                    AND AppModelID = ?
            `;
            db.get(queryDaily, [todayStr, appId], (err, sumRow) => {
                db.close();
                if (err) return reject(err);
                resolve(sumRow.total || 0);
            });
        });
    });
};

module.exports = get_time;