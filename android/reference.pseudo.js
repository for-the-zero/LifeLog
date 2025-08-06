// 伪代码，仅供参考
// Pseudo code for reference

const { global, device, status } = require('your-macro-app');

function lifelog(){
    global.addEventListener('timeChange',()=>{
        if(new Date().getMinutes % 5 === 0 && !device.isOffScreen()){
            fetch('https://your-api-url.com/post',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Key': 'your-auth-key',
                },
                body: JSON.stringify({
                    device: 'phone',
                    app_name: status.activeApp.name,
                    app_pn: status.activeApp.packageName,
                    battery: device.getBatteryLevel(),
                    time: Date.now(),
                })
            });
        };
    });
};

global.run(lifelog);