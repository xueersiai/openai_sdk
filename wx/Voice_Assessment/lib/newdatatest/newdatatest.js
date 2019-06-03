/**
 * 语音封装包裹第一版，   名称：二把刀
 * by：石可心 and 张鹏瑾
 * wx: Skx1234567890
 * 注：请使用小程序开发真机调试  
 * 小程序开发版本： v1.02.1904090
 * QQ 544254435 
 * 
 *  
 */

// 引入外部资源  包含wxparse 以及 bufferTostr  
let util = require('../utils/util.js')
let util1 = require('../demo.js')
let errorflag = '5' // 测试初始化是否有问题
let initErrorTitle = '' // 参数错误信息
let errorTotal = true;  // 录音错误处理
let showEvaluationtype = '' // 多句测评还是单句测评
let newCeping = ''

/**
 *  目前页面所需数据
 *  by 石可心
 */
let showdata = {
  // 原音按钮
  nativeVoiceImg: '/images/native-voice.png',
  nativeText: '原音',
  // Record录音按钮状态切换
  recordImg: '/images/record-voice.png',
  recordText: '点击开始录音',
  // 我的读音按钮
  myvoiceImg1: '/images/myvoice.png',
  myvoiceImg: '/images/noPlay.png',
  options: {
    duration: 600000, // 最大十分钟
    sampleRate: 16000, //采样率
    numberOfChannels: 1, //录音通道数
    // encodeBitRate: 96000, //编码码率
    encodeBitRate: 96000, //编码码率  shikexin 更改
    format: 'mp3', //音频格式，有效值 aac/mp3
    frameSize: 4, //指定帧大小，单位 KB 
  },
  showidx: '0', // 发送分片数据标示数字
  showassess_ref: '', // 评测文本
  showboolean: false, // 未点击中文英文 按钮的时候 关于 socket按钮 隐藏
  pagetitle: '语音页面',
  originUrl: '', // 原音路径
  initAiData : {}, // 存放操作底层AI数据
  identifyFnl: '',
  showmyimg:false, // 我的读音
}



/**
 * by 石可心
 * 参数0 当前this 对象
 * 参数1 1代表英文测评 2 代表中文测  ceping
 * 参数2 初始化集合  initData
 * 参数3 socket链接集合  accessModeData
 */

function showtest(event, initData, accessModeData, showinitAidata) {

  let initflag = initerror(event, initData);
  if (initflag !== "5") return
  // console.log(initflag)
  //  更新传递参数文本话术
  // 缺少当前文本播放音频
  let postdata = event.data.postList;
  console.log('postdata', postdata)
  newCeping = initData.ceping
  if (initData.ceping === '1' || initData.ceping === '2') {

    showEvaluationtype = showinitAidata.multi_sent_loop
    postdata.showassess_ref = initData.cpinfo;
    postdata.originUrl = initData.cpluyinurl;
    getApp().globalData.cpluyinurl = initData.cpluyinurl;
    postdata.ifiMG= true
    console.log('postdata.showassess_ref', postdata.showassess_ref)

  } else if (initData.ceping === '3' || initData.ceping === '4') {
    postdata.pagetitle = '识别页面'
    postdata.ifiMG = false
  }
  postdata.identifyFnl = '';
  postdata.initAiData = showinitAidata;
  postdata.showmyimg = false;
  event.setData({
    postList: postdata
  })
  console.log(event.data)
  // 缺少当前文本播放音频 
  // 更新传递参数文本话术
  /**
   * 循环当前文本使用场景
   * 1---英文测评
   * 2---中文测评
   * 3---中文识别
   * 4---英文识别
   * 参数1 测评文本  initData
   * 
   */
  switch (initData.ceping) {
    case '1':
      testGoEn(accessModeData);
      break;
    case '2':
      testGoZh(accessModeData);
      break;
    case '3':
      testGoShiBie(accessModeData, '3');
      break;
    case '4':
      testGoShiBie(accessModeData, '4');
      break;
  }
}


/**
 * by 石可心
 * 页面初始化 错误处理
 */
function initerror(event, initData) {
  let ceping = initData.ceping
  let cpinfo = initData.cpinfo
  let cpluyinurl = initData.cpluyinurl
  errorflag = '5';
  initErrorTitle = '';
  if (ceping === '' || ceping === undefined || ceping === null) {
    initErrorTitle = '提供正确选择参数'
    showError(initErrorTitle);
    errorflag = '2'
  }
  if (cpinfo === '' || cpinfo === undefined || cpinfo === null) {
    initErrorTitle = '请提供阅读文本'
    showError(initErrorTitle);
    errorflag = '3'
  }
  if (cpluyinurl === '' || cpluyinurl === undefined || cpluyinurl === null) {
    initErrorTitle = '请提供文本音频'
    showError(initErrorTitle);
    errorflag = '4'
  }
  return errorflag
}

/**
 * 错误细化
 */

function showError(item) {
  wx.showToast({
    title: item,
    icon: 'none',
    duration: 1800
  })
}

/**
 * by mujin
 * 识别
 * 
 */
function testGoShiBie(accessModeData, tag) {
  initErrorTitle = '';
  let selectindexmode = accessModeData.access_mode
  if (selectindexmode !== 1 && selectindexmode !== 2) {
    initErrorTitle = '请输入正确的接入方式 access_mode = 1 or 2'
    showError(initErrorTitle)
    errorTotal = false;
    return
  }
  let geturl = showurl(accessModeData)
  let socketurl
  console.log('tag', tag)
  if (tag === '3') {
    socketurl = 'ws://192.168.34.145:18092/v1/api/speech/asr/zh' + geturl
  } else if (tag === '4') {
    socketurl = 'ws://192.168.34.145:18092/v1/api/speech/asr/en' + geturl
  }
  console.log('socketurl-----', socketurl)
  // 链接当前socket 
  linkSocket(socketurl)
}
/**
 * by 石可心
 * 英文测评
 * 
 */
function testGoEn(accessModeData) {
  initErrorTitle = '';
  console.log('英文测评');
  let selectindexmode = accessModeData.access_mode
  if (selectindexmode !== 1 && selectindexmode !== 2) {
    initErrorTitle = '请输入正确的接入方式 access_mode = 1 or 2'
    showError(initErrorTitle)
    errorTotal = false;
    return
  }
  let geturl = showurl(accessModeData)
  let socketurl = 'ws://openapiai.xueersi.com/v1/api/speech/evl/en' + geturl; //  测试 测试 
  // 链接当前socket 
  linkSocket(socketurl)
}
/**
 * by 石可心
 * 中文测评
 * 
 */
function testGoZh(accessModeData) {
  initErrorTitle = '';
  console.log('accessModeData', accessModeData)
  let selectindexmode = accessModeData.access_mode
  if (selectindexmode !== 1 && selectindexmode !== 2) {
    initErrorTitle = '请输入正确的接入方式 access_mode = 1 or 2'
    showError(initErrorTitle)
    errorTotal = false;
    return
  }
  let geturl = showurl(accessModeData)
  console.log('中文测评');
  let socketurl = 'ws://openapiai.xueersi.com/v1/api/speech/evl/zh' + geturl;  // 新包
  // 链接当前socket 
  linkSocket(socketurl)
}

/**
 * by shikexin
 * showurl   根据接入方式 获取不同的URL 
 */
function showurl(accessModeData) {
  var randomNum = 'ai-'+('000000' + Math.floor(Math.random() * 999999)).slice(-6);
  let selectindexmode = accessModeData.access_mode
  let returnurl = '';
  // 这是快速接入 selectindexmode = 1 
  if (selectindexmode === 1){
    returnurl = '?app_key=' + accessModeData.app_key
    //这是安全接入  selectindexmode = 2 
  } else if (selectindexmode === 2){
    let getnowtime = Math.round(new Date() / 1000);
    let data1 = {
      "app_key": accessModeData.app_key,
      "nonce_str": randomNum,
      "time_stamp": getnowtime,
    };
    let newdata1 = util1.objKeySort(data1)
    let newsign = util1.getSign(data1, accessModeData.app_secret)
    data1.sign = newsign
    returnurl = util.joinParams(data1);
  }
  return returnurl
}


/**
 * by 石可心
 * socket 链接
 * 需要参数、
 * 1，socket 地址
 * 2，sockePid
 * 3，待定、。。。。
 * 
 * 
 */
function linkSocket(socketurl) {
  console.log('socket链接地址', socketurl)
  let requestsocket = wx.connectSocket({
    url: socketurl,
    success() {
      console.log('连接成功')
    },
    fail(res) {
      console.log('error', res)
      wx.showToast({
        title: '请检查您的网络，重新打开此页面',
        icon: 'none',
        duration: 1500
      })
    }
  })
  websocketCallBack()
  console.log('打印socket', requestsocket)
}

/**
 * by 石可心
 * 播放我的录音
 * 
 */
function bindMinePlay (event) {
  console.log('getApp().globalData.myRecording', getApp().globalData.myRecording)
  var innerAudioContext = wx.createInnerAudioContext();
  innerAudioContext.src = getApp().globalData.myRecording //这里可以是录音的临时路径
  innerAudioContext.play()
  innerAudioContext.onError((res) => {
    // 播放音频失败的回调
  })

}
/**
 * by 石可心
 * 播放录音
 * 
 */
function playRecording(event) {
  console.log(event)
  console.log('errorflag', errorflag)
  if (errorflag !== "5") {
    showError(initErrorTitle);
    return
  }
  let newdata = event.data.postList
  newdata.nativeVoiceImg = '/images/playing.png',
    newdata.nativeText = '播放中'
  event.setData({
    postList: newdata
  })
  /**
   * by 石可心
   * 错误处理缺少
   */
  let datasrc = getApp().globalData.cpluyinurl // 欠缺改进
  console.log(datasrc)
  var innerAudioContext = wx.createInnerAudioContext();
  // src 播放地址
  innerAudioContext.src = datasrc
  // 开始播放
  innerAudioContext.play()
  // 开始播放回调
  innerAudioContext.onPlay((res) => {
    console.log('播放回调', res)
  })
  // 播放结束回调
  innerAudioContext.onEnded(_ => {
    console.log('播完了')

    newdata.nativeVoiceImg = '/images/native-voice.png',
      newdata.nativeText = '原音'

    event.setData({
      postList: newdata
    })
  })
  // 播放错误回调
  innerAudioContext.onError((res) => {
    console.log('播放出错了', res)
  })
}

/**
 * by 石可心
 * 点击录音功能
 * 需要参数
 */
function clickRecording(event) {

  console.log('过来了开启点击录音功能', event);
  if (!errorTotal){
    console.log('退出了')
    return
  }

  if (errorflag !== "5") {
    showError(initErrorTitle);
    return
  }
  let newdata = event.data.postList;
  if (newdata.recordText == '结束录音') {
    newdata.recordImg = '/images/record-voice.png',
      newdata.recordText = '点击开始录音',
      event.setData({
        postList: newdata
      })
    //  
    closeRecording() //关闭录音
    return;
  }
  // 获取系统信息
  let systemtype = '';
  wx.getSystemInfo({
    success: function (res) {
      systemtype = res.platform
    }
  })

  // 初始化相关变量
    newdata.recordImg = '/images/stop-voice.png',
    newdata.recordText = '结束录音',
    event.setData({
      postList: newdata
    })
  // 为了测试生成6位随机状态码
  
  var randomNum = util.randomNum1()
  // 点击每次重置一次 分片语音发包从0开始进行发送 复制给准备递增的数字
  let newidx = newdata.showidx;
  // 唤起录音功能
  let recorderManager = wx.getRecorderManager()
  // 录音开始调用的方法
  recorderManager.onStart(() => {
    console.log('recorder start')
  })
  // 录音暂停事件 ，目前没有用到
  recorderManager.onPause(() => {
    console.log('recorder pause')
  })
  // 录音结束
  recorderManager.onStop((res) => {
    console.log('recorder stop', res)
    const {
      tempFilePath
    } = res //  tempFilePath  为完整录音倒计时后的 录音地址
    // 改变data 
    getApp().globalData.myRecording = tempFilePath
    console.log(getApp().globalData.myRecording)
    newdata.recordImg = '/images/record-voice.png';
    newdata.showmyimg = true;
    newdata.recordText = '点击开始录音';
      event.setData({
        postList: newdata
      })
  })

  console.log('newdata', newdata)
  // ！！! 录音重点分片式录音发送，根据分片每一片的大小来进行反复调用，直到设定事件结束或者手动结束
  recorderManager.onFrameRecorded((res) => {
    // console.log('石可心返回音频',res)
    const {
      frameBuffer
    } = res;
    // //  获取分片数据
    let newbyteLength = new Uint8Array(res.frameBuffer)
    let newbyteLength1 = []
    console.log('newbyteLength',newbyteLength)
    if (systemtype == "devtools") {
      newbyteLength1 = newbyteLength
    } else if (systemtype == "ios") {
      newbyteLength1 = newbyteLength
    } else if (systemtype == "android") {
      newbyteLength1 = newbyteLength.slice(4, newbyteLength.length - 3)
    }
    // newbyteLength1 = newbyteLength
    console.log('newbyteLength1',newbyteLength1)
    let newnewbyteLength1 = wx.arrayBufferToBase64(newbyteLength1)
    // 正常发包idx 数字累加 最后一包为负值
    newidx = res.isLastFrame ? '-' + (parseInt(newidx) + 1).toString() : (parseInt(newidx) + 1).toString()
    console.log('shikexin-idx----', newidx)
    let sendstr = util.getDataList(randomNum, newdata.showassess_ref, newidx, newnewbyteLength1, newdata.initAiData, newCeping);
    console.log('封装会来的数据数据包', sendstr);
    //拼装数据进行传输
    pushSoecket(sendstr);
    //socket 回调
    websocketCallBack(event);
  })
  recorderManager.start(showdata.options)
}

/**
 * by 石可心
 * 
 * socket 传值 发送信息
 * 1，传递参数将拼装要发送的数据当做参数
 * 
 */

function pushSoecket(postdata) {

  // socket 传值
  wx.sendSocketMessage({
    data: postdata,
    success: function (e) {
      console.log('buffer success', e)
    },
    fail: function (e) {
      console.log('buffer fail', e)
    },
    complete: function (e) {
      console.log('buffer complete', e)
    }
  });
};



/**
 * by 石可心
 * socket 回调
 * 这个可以单独拿出来
 * 
 */
function websocketCallBack(event) {
  console.log('event----', event)
  //socket 回调
  wx.onSocketMessage((res) => {
   
    var data = JSON.parse(res.data);
    console.log('123--onSocketMessage', data)
    let newdata = data.data
    console.log('456--onSocketMessage', newdata)
    console.log(data.errorCode)
    
    if (data.code != 0){
      wx.showToast({
        title: data.msg,
        icon: 'none',
        duration: 2000,
        success: function () {
          wx.onSocketClose(function (res) {
            console.log('WebSocket 已关闭！')
          })
        }
      })
      return
    }
    let newstatus = data.data.status 
    console.log('我是newCeping', newCeping)

    let ifNewCeping = newCeping === '1' || newCeping === '2'
    // 单句测评
    if (ifNewCeping && showEvaluationtype === '0'){
      if (newdata.spec.evl_flag === "fnl") {
        getApp().globalData.testResult.push(newdata)
        closeRecording()
        // 得分遮罩
        console.log('getApp().globalData.testResult', getApp().globalData.testResult)
        // return
        wx.showToast({
          title: '您的评分' + (newdata.spec.evl_scores.total_score).toString() + '分',
          icon: 'success',
          duration: 5000,
          success: function () {
            wx.navigateTo({
              url: '../../lib/followResult/followResult',
            })
            // me.socket.close()
          }
        })
      }  
       // 多句测评
    } else if (ifNewCeping && showEvaluationtype === '1') {

      let showindex = newdata.spec.new_sen_idx
      console.log(showindex)
      if (showindex >= 0 ){
        getApp().globalData.testResult.push(newdata)
      }
      console.log('全中结果', getApp().globalData.testResult)
      if (newdata.spec.evl_flag === "fnl") { 
        wx.showToast({
          title: '展示得分结果',
          icon: 'success',
          duration: 5000,
          success: function () {
            wx.navigateTo({
              url: '../../lib/followResult/followResult',
            })
            // me.socket.close()
          }
        })
      }
    } else if (newCeping === '3' || newCeping === '4') {
      if (newdata.spec.evl_flag === "fnl") {
        getApp().globalData.testResult.push(newdata)
        closeRecording()
        // 得分遮罩
        console.log('getApp().globalData.testResult', getApp().globalData.testResult)
        // wx.navigateTo({
        //   url: '../../lib/followResult/followResult',
        // })
        console.log('newdata.spec', newdata.spec)
        let postData =  event.data.postList;
        postData.identifyFnl = newdata.spec.nbest
        event.setData({
          postList: postData
        })
      } 
    }
  })
}




/**
 * 关闭录音
 * 函数
 *  想象场景什么时候需要用到关闭。。
 * 场景1：说话说完了主动关闭
 * 场景2：出现错误了主动关闭
 * 场景3：出现录音耗时最大值自动关闭  这个应该会自动关闭  但是一般需要手动关闭
 *
 */
function closeRecording() {
  console.log('嗯关闭了')
  let recorderManager = wx.getRecorderManager()
  recorderManager.stop()
}

module.exports = {
  showtest: showtest,
  showdata: showdata,
  playRecording: playRecording,
  linkSocket: linkSocket,
  clickRecording: clickRecording,
  bindMinePlay: bindMinePlay
}