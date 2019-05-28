let WxParse = require("../../lib/wxParse/wxParse.js");
// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    var replyHtml0 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";
    var replyHtml1 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";
    var replyHtml2 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";
    var replyHtml3 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";
    var replyHtml4 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";
    var replyHtml5 = "<div style='margin-top: 10px; height: 50px; '><p class='reply'>wxParse回复0: 不错，喜欢[03][04]</p > </div > ";


    var arr = [];
    arr.push(replyHtml0);
    arr.push(replyHtml1);
    arr.push(replyHtml2);
    arr.push(replyHtml3);
    arr.push(replyHtml4);
    arr.push(replyHtml5);


    for (let i = 0; i < arr.length; i++) {
      WxParse.wxParse('reply' + i, 'html', arr[i], that);
      if (i === arr.length - 1) {
        WxParse.wxParseTemArray("replyTemArray", 'reply', arr.length, that)
      }
    }
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