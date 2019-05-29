//
//  ViewController.m
//  HTTPPost
//
//  Created by 赵扬扬 on 2019/3/20.
//  Copyright © 2019 赵扬扬. All rights reserved.
//

#import "ViewController.h"

#define kOCRUrl @"http://openapiai.xueersi.com/v1/api/img/ocr/general"

#define kRequestMethod @"POST"

#define kAppkey @"app_key=8102b22a5e81e840176d9f381ec6f837"
#define kImgUrl @"img=https://ai.xueersi.com/textRecognition/images/22.jpg"
#define kImgType @"img_type=URL"
#define kContentType @"application/x-www-form-urlencoded"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self fastRequest];
}

#pragma mark - 快速接入
- (void)fastRequest
{
    // 创建请求
    NSURLSession *session = [NSURLSession sharedSession];;
    NSURL *url = [NSURL URLWithString:kOCRUrl];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    
    // 设置请求方式
    request.HTTPMethod = kRequestMethod;
    
    // 设置参数
    NSString *paramsStr = [NSString stringWithFormat:@"%@&%@&%@", kAppkey, kImgUrl, kImgType];
    request.HTTPBody = [paramsStr dataUsingEncoding:NSUTF8StringEncoding];
    
    // 设置请求头
    [request setValue:kContentType forHTTPHeaderField:@"Content-Type"];
    
    // 发起请求
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        // 返回结果
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
        NSLog(@"result=%@",dict);
    }];
    [dataTask resume];
}

#pragma mark - 安全接入
- (void)safeRequest
{
    NSURLSession *session = [NSURLSession sharedSession];
    NSURL *url = [NSURL URLWithString:kOCRUrl];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = kRequestMethod;
    NSString *time_stamp = @"time_stamp=1551174536";
    NSString *nonce_str = @"nonce_str=W8FI8oCp";
    NSString *sign = @"sign=c08d8f9900479a3b2a348c1d7dc7e918e71be66a";
    NSString *paramsStr = [NSString stringWithFormat:@"%@&%@&%@&%@&%@&%@", kAppkey, kImgUrl, kImgType, time_stamp, nonce_str, sign];
    request.HTTPBody = [paramsStr dataUsingEncoding:NSUTF8StringEncoding];
    [request setValue:kContentType forHTTPHeaderField:@"Content-Type"];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
        NSLog(@"result=%@",dict);
    }];
    [dataTask resume];
}


@end
