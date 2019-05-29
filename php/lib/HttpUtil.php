<?php

class HttpUtil
{
    private static $_http_code;

    /***
     * 获取上一次Http请求的状态码
     * @return int
     */
    public static function getHttpCode()
    {
        return self::_http_code;
    }
	
    /***
     * 执行POST请求，并取回响应结果
     * @param  string $url    URL for API
     * @param  array  $params Complete params for API
     * @return mixed
     */
    public static function doHttpPost($url, $params)
    {
        $curl = curl_init();

        $response = false;
        do
        {
            // 1. 设置HTTP URL (API地址)
            curl_setopt($curl, CURLOPT_URL, $url);

            // 2. 设置HTTP HEADER (表单POST)
            $head = array(
                'Content-Type: application/x-www-form-urlencoded'
            );
            curl_setopt($curl, CURLOPT_HTTPHEADER, $head);

            // 3. 设置HTTP BODY
            $body = http_build_query($params);
            curl_setopt($curl, CURLOPT_POST, true);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $body);

            // 4. 调用API，获取响应结果
            curl_setopt($curl, CURLOPT_HEADER, false);
            curl_setopt($curl, CURLOPT_NOBODY, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $response = curl_exec($curl);
            self::$_http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            if (self::$_http_code != 200) {
                $msg = curl_error($curl);
                $response = json_encode(array('ret' => -1, 'msg' => "sdk http post err: {$msg}", 'http_code' => self::$_http_code));
                break;
            }
        } while(0);

        curl_close($curl);
        return $response;
    }

}
