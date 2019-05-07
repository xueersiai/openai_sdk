# openai_sdk wx
学而思网校AI开发平台_wx SDK
#Voice_Assessment
#初步第一版本 
#！！！！  创建小程序，引入lib文件夹 和images 文件 （后期可能会去掉）
#1，app.js ---》globalData 对象中加入

  globalData: {
    userInfo: null,
    // 每句录音
    recordTexts: [
      'http://111.206.170.217:12001/waiyanshe/record/one/oneSen.m4a',
      'http://111.206.170.217:12001/waiyanshe/record/one/twoSen.m4a',
      'http://111.206.170.217:12001/waiyanshe/record/three/第三句.m4a',
      'http://111.206.170.217:12001/waiyanshe/record/four/第四句.m4a',
    ],
    // 储存socket 返回结果
    testResult: [],
    //
    myRecording: '',
  }

#2，在app.json 
    pages:[]  引入 "lib/followResult/followResult"


#3，假如新增了页面，---》
    "pages/newpage/newpage", 路径


#4，在newpage页面中
#   newpage.js  
                引入  var sdkdemo = require('../../lib/newdatatest/newdatatest.js')

                data: {}中加入 

                /**
                * 页面的初始数据
                */
                data: {
                    postList: sdkdemo.showdata,
                },


               onload()中加入 

                // 1 英文 2 中文
                let ceping = 1         // 2 中文
                // 测评对照阅读的文本
                let cpinfo = 'hello my name is join how are you'  //你好这是一个测试测试内容很简洁，简洁到一句两句话说不清楚
                // 测评参考录音
                let cpluyinurl = 'wwww.baidu.com'   
                //接入方式 1快速接入  2安全接入
                let access_mode =  2  
                // 测试app_key
                let app_key = '8102b22a5e81e840176d9f381ec6f837' 
                //测试app_secret
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

               新增函数 

                /**
                * 点击播放原音按钮
                */
                bindNative: function () {
                    sdkdemo.playRecording(this)  //  播放音频   
                },

                /**
                * 点击录音按钮
                */
                bindRecord: function () {
                    sdkdemo.clickRecording(this)  //  唤起接口
                },


#newpage.wxml   

                引入   <import src="/lib/newdatatest/newdatatest.wxml" />   
                增加   <template is="skxTestPage" data="{{...postList}}"/>
                    


#newpage.wxss

                引入   @import "/lib/newdatatest/newdatatest.wxss";


# 不校验合法域名
  小程序开发者工具--》右上角”详情“--》项目设置tab --》勾选”不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书“



#最终目录结构

--images
--lib
--pages
--utils
--app.js
--app.json
--app.wxss
--project.config.json




学而思网校AI开放平台_wx SDK
