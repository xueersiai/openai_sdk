#include "stdafx.h"
#include "curl/curl.h"
#include <iostream>
#include <fstream>
#include <vector>
#include "base64.h"
typedef unsigned int uint32;
using namespace std;

/**
* 一旦curl接收到数据，就会调用此回调函数
* buffer:数据缓冲区指针
* size:调试阶段总是发现为1
* nmemb:(memory block)代表此次接受的内存块的长度
* userp:用户自定义的一个参数
*/
size_t write_data(void* buffer, size_t size, size_t nmemb, void* userp)
{
	static int current_index = 0;

	cout << "current:" << current_index++;
	cout << (char*)buffer;
	cout << "---------------" << endl;

	int temp = *(int*)userp;    // 这里获取用户自定义参数
	return nmemb;
}
int main()
{
	int test_url(std::string host_url, std::string app_key, std::string img_url);
	int test_file(std::string host_url, std::string app_key, std::string  file_path);
	int test_safemodule_url(std::string host_url, std::string app_key, std::string img_url, std::string time_stamp, std::string nonce_str, std::string sign);
	//
	std::string app_key = "8102b22a5e81e840176d9f381ec6f837";
	std::string host_url = "http://openapiai.xueersi.com/v1/api/img/ocr/expreg";
	std::string img_url = "http%3A%2F%2Fai.xueersi.com%2ForalCorrection%2Fimages%2FKPI_180.jpg";
	std::string file_path = "C:/KPI_180.jpg";
	std::string time_stamp = "1551174536";
	std::string nonce_str = "W8FI8oCp";
	std::string sign = "7d15e530e58fcf3a020ec69b48d951010fa49322";
	//
	test_url(host_url,app_key,img_url);
	test_file(host_url, app_key, file_path);
	test_safemodule_url(host_url, app_key, img_url, time_stamp, nonce_str, sign);
	return 0;
}
int test_url(std::string host_url, std::string app_key, std::string img_url)
{
	curl_global_init(CURL_GLOBAL_ALL); // 首先全局初始化CURL
	CURL* curl = curl_easy_init(); // 初始化CURL句柄
	if (NULL == curl)
	{
		printf("(curl is NULL!\r\n");
		return 0;
	}
	int my_param = 1;    // 自定义一个用户参数
	// 设置目标URL
	curl_easy_setopt(curl, CURLOPT_URL, host_url.c_str());
	// 设置接收到HTTP服务器的数据时调用的回调函数
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
	// 设置自定义参数(回调函数的第四个参数)
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &my_param);
	curl_easy_setopt(curl, CURLOPT_POST, 1);//post
	std::string post_content = "";
	post_content = post_content + "app_key=" + app_key + "&";
	post_content = post_content + "img=" + img_url + "&";
	post_content = post_content + "img_type=URL";
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_content.c_str());//content
	//curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "app_key=8102b22a5e81e840176d9f381ec6f837&img=http%3A%2F%2Fai.xueersi.com%2ForalCorrection%2Fimages%2FKPI_180.jpg&img_type=URL");//content
	struct curl_slist *headers = NULL; /* init to NULL is important */
	headers = curl_slist_append(headers, "Content-Type:application/x-www-form-urlencoded");
	//headers = curl_slist_append(headers, "X-silly-content: yes");
	/* pass our list of custom made headers */
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
	// 执行一次URL请求
	CURLcode res = curl_easy_perform(curl);
	curl_slist_free_all(headers); /* free the header list */
	// 清理干净
	curl_easy_cleanup(curl);
	return 0;
}
int test_file(std::string host_url, std::string app_key, std::string file_path)
{
	curl_global_init(CURL_GLOBAL_ALL); // 首先全局初始化CURL
	CURL* curl = curl_easy_init(); // 初始化CURL句柄

	if (NULL == curl)
	{
		printf("(curl is NULL!\r\n");
		return 0;
	}
	int my_param = 1;    // 自定义一个用户参数
	// 设置目标URL
	curl_easy_setopt(curl, CURLOPT_URL, host_url.c_str());
	// 设置接收到HTTP服务器的数据时调用的回调函数
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
	// 设置自定义参数(回调函数的第四个参数)
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &my_param);
	curl_easy_setopt(curl, CURLOPT_POST, 1);//post
	//curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, false);
	struct curl_slist *headers = NULL; /* init to NULL is important */
	headers = curl_slist_append(headers, "Content-Type:application/x-www-form-urlencoded");
	//headers = curl_slist_append(headers, "X-silly-content: yes");
	/* pass our list of custom made headers */
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

	std::ifstream ifs(file_path.c_str(), std::ios_base::binary);
	if (!ifs.is_open())
	{
		// KALDI_WARN << "Open " << sEnrollWavFile << " failed!";
		std::cout << "Open " << file_path << " failed!" << std::endl;
		return -1;
	}
	const uint32 kBlockSize = 1024 * 1024;
	std::vector<char> vBuffer;
	while (ifs)
	{
		uint32 block_bytes = kBlockSize;
		uint32 offset = vBuffer.size();
		vBuffer.resize(offset + block_bytes);
		ifs.read(&vBuffer[offset], block_bytes);
		uint32 bytes_read = ifs.gcount();
		vBuffer.resize(offset + bytes_read);
	}
	std::string sTemp = "";
	for (int n = 0; n < vBuffer.size(); n++){
		sTemp += vBuffer[n];
	}
	std::string img_base64 = "";
	img_base64 = base64_encode(reinterpret_cast<const unsigned char *>(sTemp.c_str()), sTemp.length());
	char* cTemp = curl_escape(img_base64.c_str(), img_base64.size());
	std::string post_content = "";
	post_content = post_content + "app_key=" + app_key + "&";
	post_content = post_content + "img=" + cTemp + "&";
	post_content = post_content + "img_type=BASE64";
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_content.c_str());//content
	// 执行一次URL请求
	CURLcode res = curl_easy_perform(curl);
	//curl_slist_free_all(headers); /* free the header list */
	// 清理干净
	curl_easy_cleanup(curl);
	return 0;
}
int test_safemodule_url(std::string host_url, std::string app_key, std::string img_url, std::string time_stamp, std::string nonce_str, std::string sign)
{
	curl_global_init(CURL_GLOBAL_ALL); // 首先全局初始化CURL
	CURL* curl = curl_easy_init(); // 初始化CURL句柄
	if (NULL == curl)
	{
		printf("(curl is NULL!\r\n");
		return 0;
	}
	int my_param = 1;    // 自定义一个用户参数
	// 设置目标URL
	curl_easy_setopt(curl, CURLOPT_URL, host_url.c_str());
	// 设置接收到HTTP服务器的数据时调用的回调函数
	curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
	// 设置自定义参数(回调函数的第四个参数)
	curl_easy_setopt(curl, CURLOPT_WRITEDATA, &my_param);
	curl_easy_setopt(curl, CURLOPT_POST, 1);//post
	std::string post_content = "";
	post_content = post_content + "app_key=" + app_key + "&";
	post_content = post_content + "img=" + img_url + "&";
	post_content = post_content + "img_type=URL"+"&";
	post_content = post_content + "time_stamp="+time_stamp+"&";
	post_content = post_content + "nonce_str=" + nonce_str + "&";
	post_content = post_content + "sign=" + sign;
	curl_easy_setopt(curl, CURLOPT_POSTFIELDS, post_content.c_str());//content
	//curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "app_key=8102b22a5e81e840176d9f381ec6f837&img=http%3A%2F%2Fai.xueersi.com%2ForalCorrection%2Fimages%2FKPI_180.jpg&img_type=URL");//content
	struct curl_slist *headers = NULL; /* init to NULL is important */
	headers = curl_slist_append(headers, "Content-Type:application/x-www-form-urlencoded");
	//headers = curl_slist_append(headers, "X-silly-content: yes");
	/* pass our list of custom made headers */
	curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
	// 执行一次URL请求
	CURLcode res = curl_easy_perform(curl);
	curl_slist_free_all(headers); /* free the header list */
	// 清理干净
	curl_easy_cleanup(curl);
	return 0;
}