<?php
require_once('./include.php');

// OCR文字识别（URL/BASE64）
//// URL类型
// 请在此填写请求参数
$params = array(
    'app_key'  => '',
    'img'      => 'https://ai.xueersi.com/textRecognition/images/22.jpg',
    'img_type' => 'URL',
);

$response = API::ocrGeneral($params);
var_dump($response);
echo '<br>';
// sleep(1);
// //// BASE64类型
// $image_data = file_get_contents('./data/ocr_general.jpg');
// $params = array(
//     'app_key'  => 'f97dcd98f0c5b8a8987b4230ee34b3b51d99289b',
//     'img'      => base64_encode($image_data),
//     'img_type' => 'BASE64',
// );
// $response = API::ocrGeneral($params);
// var_dump($response);
// echo '<br>';
// sleep(1);

// // OCR速算（URL/BASE64）
// //// URL类型
// $params = array(
//     'app_key'  => 'f97dcd98f0c5b8a8987b4230ee34b3b51d99289b',
//     'img'      => 'https://ai.xueersi.com/oralCorrection/images/test.jpg',
//     'img_type' => 'URL',
// );
// $response = API::ocrExpreg($params);
// var_dump($response);
// echo '<br>';
// sleep(1);
// //// BASE64类型
// $image_data = file_get_contents('./data/ocr_expreg.jpg');
// $params = array(
//     'app_key'  => 'f97dcd98f0c5b8a8987b4230ee34b3b51d99289b',
//     'img'      => base64_encode($image_data),
//     'img_type' => 'BASE64',
// );
// $response = API::ocrExpreg($params);
// var_dump($response);
// sleep(1);
