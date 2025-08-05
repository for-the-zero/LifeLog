const { app, Tray, Menu, nativeImage, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');

const get_time = require('./db');
const { getActiveWindowInfo } = require('./get-active');

const config = require('./config.json');
const { get } = require('http');

if(app.isPackaged){
    app.setLoginItemSettings({ openAtLogin: true });
};

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

function restart_as_admin() {
    const elevatePath = path.join(process.resourcesPath, 'elevate.exe');
    const exePath = process.execPath;
    console.log('elevate.exe 路径:', elevatePath);
    console.log('目标 EXE 路径:', exePath);
    const child = spawn(elevatePath, [exePath], {
        detached: true,
        stdio: 'ignore',
    });
    child.unref();
    app.quit();
};

var screenshot_mode = 1;
const ss_mode_change = (mode) => {
    screenshot_mode = mode;
};

let tray = null;
app.whenReady().then(() => {
    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '截图模式', type: 'submenu', submenu: [
            { label: '关闭', type: 'radio', checked: screenshot_mode === 0, click: () => { ss_mode_change(0) } },
            { label: '按键检测', type: 'radio', checked: screenshot_mode === 1, click: () => { ss_mode_change(0) } },
            { label: '剪贴板识别', type: 'radio', checked: screenshot_mode === 2, click: () => { ss_mode_change(0) } },
        ] },
        { type: 'separator'},

        { label: '管理员身份重启', type: 'normal', click: () => { restart_as_admin() } },
        { label: '马上发送数据', type: 'normal', click: ()=>{setTimeout(send_data, 500);} },
        { label: '退出', type: 'normal', click: () => { app.quit() } }
    ]);
    tray.setContextMenu(contextMenu);
});