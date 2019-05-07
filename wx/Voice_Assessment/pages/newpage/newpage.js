var sdkdemo = require('../../lib/newdatatest/newdatatest.js')
// pages/newpage/newpage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: sdkdemo.showdata,
  },
  /**
  * 点击播放原音按钮
  */
  bindNative: function () {
    sdkdemo.playRecording(this)  //  播放音频   
  },
  /**
   * 初始化方法
   */
  initsystem: function () {
    getApp().globalData.testResult=[];
    this.onLoad();
  },
  /**
  * 点击录音按钮
  */
  bindRecord: function () {
    sdkdemo.clickRecording(this)  //  唤起接口
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1 英文 2 中文
    let ceping = 2        
    // 测评对照阅读的文本
    let cpinfo = '您好这是一个测试测试内容很简洁，简洁到一句两句话说不清楚'  
    // 测评参考录音
    let cpluyinurl = 'http://111.206.170.217:12001/waiyanshe/record/one/oneSen.m4a'
    //接入方式 1快速接入  2安全接入
    let access_mode = 2
    //app_key
    let app_key = '8102b22a5e81e840176d9f381ec6f837'
    //app_secret
    let app_secret = 'f308ce31e42e366093c01e5283f1acc02c2cd47492f5c8633b55d58930be2b2c'

    //  初始化数据
    let initData = {
      "ceping": ceping,
      "cpinfo": cpinfo,
      "cpluyinurl": cpluyinurl
    };
    //  接入方式数据
    let accessModeData = {
      "access_mode": access_mode,
      "app_key": app_key,
      "app_secret": app_secret
    }
    sdkdemo.showtest(this, initData, accessModeData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})