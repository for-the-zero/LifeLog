const { app, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const cron = require('node-cron');
const get_time = require('./db');
const { getActiveWindowInfo } = require('./get-active');

const config = require('./config.json');
const { get } = require('http');

cron.schedule('5,15,25,35,45,55 * * * *', send_data);
async function send_data(){
    let active = await getActiveWindowInfo();
    let time = await get_time(active.path);
    try{
        fetch(config.server_url + '/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Key': config.key,
            },
            body: JSON.stringify({
                device: 'laptop',
                app_title: active.title,
                app_exe: active.exe,
                time: time,
            }),
        });
    }catch(e){
        console.error(e);
        dialog.showErrorBox('错误', e.message);
    };
};

let tray = null;
app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '马上发送数据', type: 'normal', click: ()=>{setTimeout(send_data, 500);} },
        { label: '退出', type: 'normal', click: () => app.quit() }
    ]);
    tray.setContextMenu(contextMenu);
});