// 不会写一点，直接呼叫Kimi K2

const ffi   = require('ffi-napi');
const ref   = require('ref-napi');
const wchar = require('ref-wchar-napi');

/* -------------------------------------------------
 *  1. API 绑定
 * -------------------------------------------------*/
const kernel32 = ffi.Library('kernel32', {
    OpenProcess                : ['pointer', ['uint32', 'int', 'uint32']],
    CloseHandle                : ['int',   ['pointer']],
    K32GetProcessImageFileNameW: ['uint32', ['pointer', 'pointer', 'uint32']],
    QueryDosDeviceW            : ['uint32', ['pointer', 'pointer', 'uint32']],
});

const user32 = ffi.Library('user32', {
    GetForegroundWindow    : ['pointer', []],
    GetWindowTextW         : ['int',   ['pointer', 'pointer', 'int']],
    GetWindowThreadProcessId: ['uint32', ['pointer', 'uint32*']],
});

/* -------------------------------------------------
 *  2. 常量
 * -------------------------------------------------*/
const MAX_PATH = 260;
const PROCESS_QUERY_LIMITED_INFORMATION = 0x1000;

/* -------------------------------------------------
 *  3. 把 \Device\HarddiskVolumeX\xx\xx.exe
 *     换成 C:\xx\xx.exe
 * -------------------------------------------------*/
function ntPathToWin32(ntPath) {
    // 1) 枚举 A: ~ Z:，找出对应的 \Device\HarddiskVolumeX
    for (let drive = 65; drive <= 90; drive++) {      // 65 -> 'A'
        const driveStr = String.fromCharCode(drive) + ':';
        const buf = Buffer.alloc(MAX_PATH * 2);
        const len = kernel32.QueryDosDeviceW(
            Buffer.from(driveStr + '\0', 'ucs2'), buf, MAX_PATH
        );
        if (len) {
            const devPath = wchar.toString(buf, 0, MAX_PATH).replace(/\0+$/, '');
            if (ntPath.startsWith(devPath)) {
                return ntPath.replace(devPath, driveStr);
            }
        }
    }
    // 没映射上就直接原样返回
    return ntPath;
}

/* -------------------------------------------------
 *  4. 获取当前前台窗口信息
 * -------------------------------------------------*/
function getActiveWindowInfo() {
    const hwnd = user32.GetForegroundWindow();
    if (hwnd.isNull()) return { title: null, exe: null, path: null };

    // 标题
    const bufTitle = Buffer.alloc(MAX_PATH * 2);
    user32.GetWindowTextW(hwnd, bufTitle, MAX_PATH);
    const title = wchar.toString(bufTitle, 0, MAX_PATH).replace(/\0+$/, '');

    // PID
    const pidPtr = ref.alloc('uint32');
    user32.GetWindowThreadProcessId(hwnd, pidPtr);
    const pid = pidPtr.deref();

    // 进程镜像路径
    const hProc = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, 0, pid);
    if (hProc.isNull()) return { title, exe: null, path: null };

    const bufPath = Buffer.alloc(MAX_PATH * 2);
    const len = kernel32.K32GetProcessImageFileNameW(hProc, bufPath, MAX_PATH);
    kernel32.CloseHandle(hProc);

    if (len === 0) return { title, exe: null, path: null };

    const ntPath = wchar.toString(bufPath, 0, MAX_PATH).replace(/\0+$/, '');
    const win32Path = ntPathToWin32(ntPath);
    const exe = win32Path.split('\\').pop();

    return { title, exe, path: win32Path };
}

/* -------------------------------------------------
 *  5. 导出
 * -------------------------------------------------*/

setInterval(() => {
    const info = getActiveWindowInfo();
    console.log(info);
}, 1000);

module.exports = getActiveWindowInfo;