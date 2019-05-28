// string类型
var testid = "1"
// string类型
var liveid = "2"
var stuid = 3;

/**
 * 录音状态
 * 0:初始化 1：点击开始 2：录音中 3：点击停止 4：返回正常结果 5：返回错误
 */
var process = {
    'state': 0
}

// 回调事件	
var on = {
    // 音量发生变化时
    volume: function (value) {
        // console.log('volume')
        // console.log(value)
        $("#volume").text(value)
    },
    // 点击开始
    start: function () {
        $("#volume").text('');
        $("#audio").attr('src', '');
        $("#result").text('');
        $("#error").text('');
    },
    // 点击结束
    stop: function () {
        var file = session.getMp3Blob();
        var url = URL.createObjectURL(file);
        $("#audio").attr('src', url);
    },
    // 录音中
    record: function () {
        process.state = 2
        // console.log('record')
        // console.log(err)
        // console.log(result)
    },
    // 处理返回结果
    result: function (result) {
        process.state = 4
        console.log(result)
        result = JSON.stringify(result)
        // console.log('result')
        // console.log(err)
        // console.log(result)
        $("#result").html($("#result").text() + '<br/>' + result);
    },
    // 处理错误
    error: function (err) {
        process.state = 5
        console.log(err)
        $("#error").html(err);
    },
    // 音量太小提示
    low: function () {

    }
}
var session = new XueASR({
    "callback": {
        "onResult": on.result,
        "onVolume": on.volume,
        "onError": on.error,
        "onProcess": function (status) {
            switch (status) {
                // 录音中
                case 'onRecord':
                    on.record();
                    break;
                    // 停止
                case 'onStop':
                    on.stop();
                    break;
                    // 开始
                case 'onStart':
                    on.start();
                    break;
                    // 声音过小
                case 'lowVolume':
                    on.low();
                    break;
                default:
            }
        }
    }
});

$("#start").click(start)
$("#end").click(end)


// 当点击了开始
function start() {
    // 不能重复点击
    if (process.state == 1) return;
    process.state = 1
    var params = {}
    params.webscoketURL = "wss://asr.xueersi.com/wsh5";
    // 中文
    // params.ise_word="好雨知时节，当春乃发生。随风潜入夜，润物细无声。";
    // params.pid="1103103";
    // 英文
    params.ise_word = chineseAnswerContent[textIndex];
    params.pid = "1103103";
    params.mergeNum = 2;
    params.resendURL = 'http://asr.xueersi.com/post';
    params.resend = true;
    params.resendInterval = 5000;
    params.testid = testid
    params.liveid = liveid
    params.stuid = stuid
    session.start(params)
    console.log(session.isSupport())
}

// 点击了结束
function end() {
    process.state = 3
    session.stop()
}