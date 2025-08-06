const { app, Tray, Menu, nativeImage, dialog, clipboard, globalShortcut } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');
const { screen } = require('@nut-tree-fork/nut-js');
const get_time = require('./db');
const { getActiveWindowInfo } = require('./get-active');

const config = require('./config.json');
const { get } = require('http');

if(app.isPackaged){
    app.setLoginItemSettings({ openAtLogin: true });
};

cron.schedule('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', send_data);
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
                used: time,
                time: Date.now(),
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

let tray = null;
app.whenReady().then(() => {

    var screenshot_mode = 1;
    const ss_mode_change = (mode) => {
        screenshot_mode = mode;
        switch (mode) {
            case 0:
                del_ssmode1();
                del_ssmode2();
                break;
            case 1:
                reg_ssmode1();
                del_ssmode2();
                break;
            case 2:
                del_ssmode1();
                reg_ssmode2();
                break;
            default:
                break;
        };
    };
    ss_mode_change(1);

    tray = new Tray(path.join(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: '截图模式', type: 'submenu', submenu: [
            { label: '关闭', type: 'radio', checked: screenshot_mode === 0, click: () => { ss_mode_change(0) } },
            { label: '按键检测', type: 'radio', checked: screenshot_mode === 1, click: () => { ss_mode_change(1) } },
            { label: '剪贴板识别', type: 'radio', checked: screenshot_mode === 2, click: () => { ss_mode_change(2) } },
        ] },
        { type: 'separator'},

        { label: '管理员身份重启', type: 'normal', click: () => { restart_as_admin() } },
        { label: '马上发送数据', type: 'normal', click: ()=>{setTimeout(send_data, 500);} },
        { label: '退出', type: 'normal', click: () => { app.quit() } }
    ]);
    tray.setContextMenu(contextMenu);
});

if(fs.existsSync(config.ss_save_path) === false){
    fs.mkdirSync(config.ss_save_path, { recursive: true });
};

function del_ssmode1(){
    globalShortcut.unregister('PrintScreen');
};
function reg_ssmode1(){
    globalShortcut.register('PrintScreen',async()=>{
        await screen.capture(
            fileName=`screenshot_${Date.now()}`,
            fileFormat='.png',
            filePath=config.ss_save_path
        );
        //console.log('Screenshot saved');
    });
};

var ssm2_interval = null;
var ssm2_last_hash = null;
function del_ssmode2(){
    if(ssm2_interval){
        clearInterval(ssm2_interval);
        ssm2_interval = null;
    };
};
function reg_ssmode2(){
    ssm2_interval = setInterval(()=>{
        const image = clipboard.readImage();
        let hash = image.toDataURL();
        if( image.isEmpty() || hash === ssm2_last_hash ){return;};
        ssm2_last_hash = hash;
        fs.writeFile(
            path.join(config.ss_save_path, `screenshot_${Date.now()}.png`), 
            image.toPNG(), 
            (err) => {
                if(err){
                    console.error(err);
                    dialog.showErrorBox('错误', err.message);
                }else{
                    //console.log('Screenshot saved');
                };
            }
        );
    },1000);
};