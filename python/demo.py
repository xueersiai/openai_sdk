from  XesOcr import *

#快速接入
#   QuickAccess(app_key)
#   @app_key  由 https://ai.xueersi.com/ 登录获取，必填
qa=QuickAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c")
#   qa.play(img,imgType,interface)
#   @img  图像本地路径/ULR
#   @imgType 图像传输类型，本地图像和网络图像分别使用"base64","URL"指定，必填
#   @interface  功能，包含文字识别，公式识别，OCR速算，使用"general","formula","expreg"指定，必填
res=qa.play("https://mr.xesimg.com/home/2019/05/25/1558782271216292016511.jpg",'URL','general')
print(res)


#安全接入
#   SafeAccess(app_key,app_secret)
#   @app_key  由 https://ai.xueersi.com/ 登录获取，必填
#   @app_secret  由 https://ai.xueersi.com/ 登录获取，必填
sa=SafeAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c","7d96a4e9fa3587d803a295f05f34c2ccbd5763d6af0d7e025d03e4220e7facbe")
#   qa.play(img,imgType,interface)
#   @img  图像本地路径/ULR
#   @imgType 图像传输类型，本地图像和网络图像分别使用"base64","URL"指定，必填
#   @interface  功能，包含文字识别，公式识别，OCR速算，使用"general","formula","expreg"指定，必填
res=sa.play("./test.jpg",'base64','general')
print(res)
