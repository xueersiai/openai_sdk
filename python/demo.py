from  XesOcr import *

#quick accesss demo
qa=QuickAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c")
res=qa.play("https://mr.xesimg.com/home/2019/05/25/1558782271216292016511.jpg",'URL','general')
print(res)


#safe access demo
sa=SafeAccess("03f7634cfca98ea99e25e175cd42bc7aece1203c","7d96a4e9fa3587d803a295f05f34c2ccbd5763d6af0d7e025d03e4220e7facbe")
res=sa.play("./test.jpg",'base64','general')
print(res)
