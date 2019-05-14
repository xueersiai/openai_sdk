let WxParse = require("../../lib/wxParse/wxParse.js");
Page({
  data: {
    resultText0: [],
    resultText1: [],
    resultText2: [],
    resultText3: [],
    sentenceResult: [],
    resultAll: getApp().globalData.testResult,
    totalScore: '', // 总分
    contScore: '', // 连贯分
    pronScore: '', // 发音分
    innerAudioContext: ''
  },
  onLoad: function () {    
    // console.log('返回',getApp().globalData.testResult)
    // this.showSentence(getApp().globalData.testResult[0].data.asr_content.nbest)
    this.showSentence(getApp().globalData.testResult)
  },
  search: function () {
    wx.navigateTo({
      url: '../followRead/followRead'
    })
  },
  showSentence: function (resultTotal) {
    console.log('第二个页面',resultTotal)
    // return;
    var sentenceResult = [] 
    console.log(resultTotal.length)
    var totalScore = 0
    var contScore = 0
    var pronScore = 0
    for (var j = 0; j < resultTotal.length;j++) {
      // debugger
      console.log('showSentence')
      var result = resultTotal[j].spec.nbest
      // this.setData({
      //   lowWord: []  
      // })
      var low = []
      // var result = ["How:90, are:70, you:45"]
      // split方法把字符串分割成字符串数组
      // split分割字符串
      var pos = result[0].split(',')
      console.log(pos)
      var sentence = ''
      for (var i = 0; i < pos.length; i++) {
        var word = pos[i].split(':')
        if (word[1] >= 80) {
          sentence += "<span style='color: #14AC84;padding-right:5px;display:inline-block'>" + word[0].toLowerCase() + "</span>";
        } else if (word[1] >= 60) {
          sentence += "<span style='color: #000;padding-right:5px;display:inline-block'>" + word[0].toLowerCase() + "   </span>";
        } else {
          low.push({
            // 相对句子第index个单词
            'index': i,
            'word': word[0].toLowerCase(),
            'fraction': word[1]
          })
          sentence += "<span style='color: #E26C80;padding-right:5px;display:inline-block'>" + word[0].toLowerCase() + "   </span>";
        }
        console.log('skx-sentence1',sentence)
        console.log('skx-low',low)
      }
      console.log('skx-sentence2',sentence)
      sentenceResult.push({
        'sentence': sentence,
        'lowWord': low,
        'myscore': resultTotal[j].spec.evl_scores.total_score,
        'nbm': 'resultText' + j
        })
      totalScore += resultTotal[j].spec.evl_scores.total_score
      contScore += resultTotal[j].spec.evl_scores.cont_score
      pronScore += resultTotal[j].spec.evl_scores.pron_score

      console.log(j)
    } 
    totalScore = parseInt(totalScore / (resultTotal.length))
    contScore = parseInt(contScore / (resultTotal.length))
    pronScore = parseInt(pronScore / (resultTotal.length))

    this.setData({
      'sentenceResult': sentenceResult,
      'totalScore': totalScore,
      'contScore': contScore,
      'pronScore': pronScore
    })
    console.log('skx_sentenceResult',sentenceResult)
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    // console.log('这是几呀？', sentenceResult)
    var that = this;
    for (let i = 0; i < sentenceResult.length; i++) {
      WxParse.wxParse('reply' + i, 'html', sentenceResult[i].sentence, that);
      if (i === sentenceResult.length - 1) {
        WxParse.wxParseTemArray("replyTemArray", 'reply', sentenceResult.length, that)
      }
    }

  }, 
  // 正确的发音
  rightVoice: function (e) {
    var pageidx = parseInt(e.currentTarget.dataset['pageindex']);
    var wordidx = parseInt(e.currentTarget.dataset['wordindex']);
    
    console.log(pageidx)
    console.log(wordidx)
    
    var _this = this
    var singleWord = getApp().globalData.singleWord
    console.log(singleWord[pageidx][wordidx])
    
    // 音频只初始化一次
    if (this.data.innerAudioContext == '') {
      var innerAudioContext = wx.createInnerAudioContext();
      this.setData({
        innerAudioContext: innerAudioContext,
      })
    }
    this.data.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.data.innerAudioContext.onEnded(function () {
      _this.setData({
        
      })
    })
    this.data.innerAudioContext.src = singleWord[pageidx][wordidx]
    this.data.innerAudioContext.play()
  },
  // 点击'我的读音'播放按钮触发
  bindMinePlay: function () {
    console.log(this.data.stopVoice)
    var _this = this
    if (this.data.src == '') {
      return
    }
    this.setData({
      // myvoiceImg: '/images/playing.png',
    })
    // 控制音频播放只初始化一次
    if (this.data.innerAudioContext == '') {
      var innerAudioContext = wx.createInnerAudioContext();
      this.setData({
        innerAudioContext: innerAudioContext,
      })
    }
    this.data.innerAudioContext.src = getApp().globalData.myRecording //这里可以是录音的临时路径
    this.data.innerAudioContext.play()

    this.data.innerAudioContext.onError((res) => {
      // 播放音频失败的回调
    })
    this.data.innerAudioContext.onEnded(function () {
      _this.setData({
        // myvoiceImg: '/images/myvoice.png',
      })
    })
  },
  // 点击'原音'
  bindNative: function (e) {
    var pageidx = parseInt(e.currentTarget.dataset['pageindex']);
    // debugger
    // console.log(this.data.stopVoice)
    var _this = this
    var recordTextsSrc = getApp().globalData.recordTexts
    // console.log(recordTextsSrc[0])
    if (this.data.innerAudioContext == '') {
      var innerAudioContext = wx.createInnerAudioContext();
      this.setData({
        innerAudioContext: innerAudioContext,
      })
    }
    // console.log(this.data.index)
    console.log(this.data.innerAudioContext)
    this.data.innerAudioContext.src = recordTextsSrc[pageidx] //这里可以是录音的临时路径
    this.data.innerAudioContext.play()
    this.data.innerAudioContext.onPlay(function () {
      // this.data.innerAudioContext.pause()
      console.log('onplay')
      // _this.setData({
      //   stopVoice: false,
      //   nativeVoiceImg: '/images/playing.png',
      // })
    })
    this.data.innerAudioContext.onEnded(function () {
      _this.setData({
        // nativeVoiceImg: '/images/myvoice.png',
      })
    })
    this.setData({
      // nativeVoiceImg: '/images/playing.png',
      // nativeText: '播放中',
    })
  }
})
