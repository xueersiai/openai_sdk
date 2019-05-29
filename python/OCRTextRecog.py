import http.client
import urllib
import base64

with open('./test.jpg', 'rb') as bin_data:
	image_data = bin_data.read()
image_data_base64 = base64.b64encode(image_data)
image_data_base64 = urllib.parse.quote(image_data_base64)
conn = http.client.HTTPConnection("openapiai.xueersi.com")
appkey_string = 'app_key=8102b22a5e81e840176d9f381ec6f837'
img_string = 'img=' + image_data_base64
img_type_string = 'img_type=base64'
payload = appkey_string + '&' + img_string + '&' + img_type_string
headers = {
    'Content-Type': "application/x-www-form-urlencoded",
    'cache-control': "no-cache",
}
conn.request("POST", "/v1/api/img/ocr/general/", payload, headers)
res = conn.getresponse()
data = res.read()
print(data)
conn.close()
