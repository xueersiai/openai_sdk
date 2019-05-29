
##快速接入
&nbsp; QuickAccess(app_key)</br>
&nbsp; &nbsp; &nbsp; @构造对象</br>
&nbsp; &nbsp; &nbsp; @app_key  由 https://ai.xueersi.com/ 登录获取，必填</br>
```
qa=QuickAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c")
```


&nbsp;  play(img,imgType,interface)</br>
&nbsp; &nbsp; &nbsp; @执行请求</br>
&nbsp; &nbsp; &nbsp; @img  图像本地路径/ULR</br>
&nbsp; &nbsp; &nbsp; @imgType 图像传输类型，本地图像和网络图像分别使用串"base64","URL"指定，必填</br>
&nbsp; &nbsp; &nbsp; @interface  功能，包含文字识别，公式识别，OCR速算，使用串"general","formula","expreg"指定，必填</br>
```
res=qa.play("https://mr.xesimg.com/home/2019/05/25/1558782271216292016511.jpg",'URL','general')
print(res)
```
##安全接入
&nbsp; SafeAccess(app_key,app_secret)</br> 
&nbsp; &nbsp; &nbsp; @构造对象</br>
&nbsp; &nbsp; &nbsp; @app_key  由 https://ai.xueersi.com/ 登录获取，必填</br>
&nbsp; &nbsp; &nbsp; @app_secret  由 https://ai.xueersi.com/ 登录获取，必填</br>
```
sa=SafeAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c","7d96a4e9fa3587d803a295f05f34c2ccbd5763d6af0d7e025d03e4220e7facbe")
```


&nbsp;  play(img,imgType,interface)</br>
&nbsp; &nbsp; &nbsp; @执行请求</br>
&nbsp; &nbsp; &nbsp; @img  图像本地路径/ULR</br>
&nbsp; &nbsp; &nbsp; @imgType 图像传输类型，本地图像和网络图像分别使用串"base64","URL"指定，必填</br>
&nbsp; &nbsp; &nbsp; @interface  功能，包含文字识别，公式识别，OCR速算，使用串"general","formula","expreg"指定，必填</br>
```
res=sa.play("./test.jpg",'base64','general')
print(res)
```
