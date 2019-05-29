import http.client
import base64
import sys,os
import time
import uuid
import hashlib
if sys.version_info.major == 2:
    from urllib import urlencode
    from urllib import quote
    from urlparse import urlparse
else:
    from urllib.parse import urlencode
    from urllib.parse import quote
    from urllib.parse import urlparse

class QuickAccess(object):
    def __init__(self,appkey):
        if len(appkey)<16:
            print("appkey wrong ! please modify and try again !")
            exit()
        self._appkey=appkey.strip()
        self.__headers ={
                            'Content-Type': "application/x-www-form-urlencoded",
                            'cache-control': "no-cache",
                        }
        self.__version = 'v1.0'
        self.__ImgTypeDic={"base64":"base64","b":"base64","url":"URL","u":"URL"}
        self.__FuncTypeDic={"formula":"formula","f":"formula","general":"general","g":"general","expreg":"expreg","e":"expreg"}
        self.__conn=http.client.HTTPConnection("openapiai.xueersi.com")
    
    def _imgTypeCheck(self,imgType):
        imgType=imgType.strip().lower()
        if imgType not in self.__ImgTypeDic.keys():
            print("image type wrong ! image type must be 'base64' or 'URL',please modify and try again !")
            exit()
        return self.__ImgTypeDic[imgType]

    def _imgCheck(self,img):
        if len(img)<=0:
            print(" image wrong ! please modify and try again !")
        return img

    def _funcTypeCheck(self,interface):
        interface=interface.strip().lower()
        if interface  not in self.__FuncTypeDic.keys():
            print("interface wrong ! interface must be 'general','expreg' or 'formula' ,please modify and try again !")
            exit()
        interface="/v1/api/img/ocr/"+self.__FuncTypeDic[interface]+"/"
        return interface
        
    def _getImgData(self,imgpath):
        with open(imgpath, 'rb') as bin_data:
            image_data = bin_data.read()
        image_data_base64 = base64.b64encode(image_data)
        image_data_base64 = quote(image_data_base64)
        return image_data_base64

    def _makeRequestStr(self,dic):
        lst=[]
        for key,val in dic.items():
            s="%s=%s" % (key,val)
            lst.append(s)
        res = "&".join(lst)
        return res

    def _makeRequestInfo(self,img,imgType):
        payload=dict()
        payload['app_key']=self._appkey
        payload['img_type']=imgType
        if imgType == 'base64':
            payload['img']=self._getImgData(img)
        else :
            payload['img']=img
        return payload

    def play(self,img,imgType,interface):
        self.__conn.request("POST",self._funcTypeCheck(interface),self._makeRequestStr(self._makeRequestInfo(self._imgCheck(img),self._imgTypeCheck(imgType))), self.__headers)
        res = self.__conn.getresponse()
        data = res.read()
        return data

class  SafeAccess(QuickAccess):
    def __init__(self,appkey,appsecret):
        if len(appsecret)<=0:
            print("app secret wrong ! please modify and try again !")
            exit()
        QuickAccess.__init__(self,appkey)
        self.__appsecret=appsecret.strip()
        
    def _makeRequestInfo(self,img,imgType):
        payload = super()._makeRequestInfo(img,imgType)
        dic=dict()
        dic["time_stamp"]=str(int(time.time()))
        curruuid1=str(uuid.uuid1())
        if len(curruuid1)>32:
            curruuid1=curruuid1[0:32]
        dic["nonce_str"]=curruuid1
        dic["app_key"]=self._appkey
        dic=sorted(dic.items(),key=lambda ele:ele[0])
        dic=dict(dic)
        sign=''
        for ele in dic.values():
            sign+=ele
        sign+=self.__appsecret
        sha1=hashlib.sha1()
        sha1.update(sign.encode('utf-8'))
        sign=sha1.hexdigest()
        payload["time_stamp"]=dic["time_stamp"]
        payload["nonce_str"]=dic["nonce_str"]
        payload["sign"]=sign
        return payload
