import {activeWindow} from 'get-windows';

async function getActiveWindowInfo(){
    const res = await activeWindow();
    if(!res){return null;}
    return {
        title: res.title,
        path: res.owner.path,
        exe: res.owner.path.split('\\').pop(),
    };
};

// setInterval(async() => {
//     const info = await getActiveWindowInfo();
//     console.log(info);
// }, 1000);

export {getActiveWindowInfo};