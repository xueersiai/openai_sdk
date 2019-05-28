<?php

class API
{
    /***
     * 判断一个字符串是否经过base64
     * @param  string $str
     * @return bool
     */
    private static function _is_base64($str)
    {
        return $str == base64_encode(base64_decode($str)) ? true : false;
    }

    /***
     * 调用OCR文字识别接口
     * @param  array $params
     * @return array
     */
    public static function ocrGeneral($params)
    {
        if ($params['img_type'] === 'BASE64') {
            if (!self::_is_base64($params['img'])) {
                $params['img'] = base64_encode($params['img']);
            }
        } else {
            if ($params['img_type'] !== 'URL') {
                $response = json_encode(array('code' => -1, 'msg' => "img_type must belong to BASE64 or URL"));
                return $response;
            }
        }
        $url = Configer::API_URL_PATH . '/img/ocr/general';
        $response = HttpUtil::doHttpPost($url, $params);
        return $response;
    }

    /***
     * 调用OCR速算接口
     * @param  array $params
     * @return array
     */
    public static function ocrExpreg($params)
    {
        if ($params['img_type'] === 'BASE64') {
            if (!self::_is_base64($params['img'])) {
                $params['img'] = base64_encode($params['img']);
            }
        } else {
            if ($params['img_type'] !== 'URL') {
                $response = json_encode(array('code' => -1, 'msg' => "img_type must belong to BASE64 or URL"));
                return $response;
            }
        }
        $url = Configer::API_URL_PATH . '/img/ocr/expreg';
        $response = HttpUtil::doHttpPost($url, $params);
        return $response;
    }
}
