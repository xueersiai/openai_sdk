 
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    /// <summary>
    /// Created by 杨海旭 on 2019/3/20.
    /// </summary>
    class Program
    {
        static string base64 = "";

        static string ap_key = "8102b22a5e81e840176d9f381ec6f837";

        // 安全接入时建议换成自己的app_key和app_secret        
        static string ap_secret = "f308ce31e42e366093c01e5283f1acc02c2cd47492f5c8633b55d58930be2b2c";

        static string nonce_str = "fa577ce340859f9fe";

        static string tim;
        static void Main(string[] args)
        {
            tim = Time();
            base64 = "https://xeswxapp.oss-cn-beijing.aliyuncs.com/Unity/net/05-15-14-26-09-158-80236d46d237450310a5f1926889c508.jpg";
            string safetyPost = SafetyPost();
            Console.WriteLine("安全接入方式:\n" + safetyPost);

            string celerityPost = CelerityPost();
            Console.WriteLine("快速接入方式:\n" + celerityPost);
            Console.ReadLine();
        }
        /// <summary>
        /// 安全接入方式
        /// </summary>
        /// <returns></returns>
        private static string SafetyPost()
        {
            string url = "http://openapiai.xueersi.com/v1/api/img/ocr/expreg";//URL地址
         //   string payload = "app_key=8102b22a5e81e840176d9f381ec6f837&img=http%3A%2F%2Fai.xueersi.com%2ForalCorrection%2Fimages%2FKPI_180.jpg&img_type=URL&time_stamp="+ Time ()+ "&nonce_str=W8FI8oCp&sign=7d15e530e58fcf3a020ec69b48d951010fa49322";
            string payload = "app_key="+ ap_key + "&img=" + base64 + "&img_type=URL&time_stamp=" + tim + "&nonce_str="+ nonce_str + "&sign=" + GetSign(ap_key, ap_secret, tim);
            Console.WriteLine("payload:\n" + payload);
            CookieContainer cookieContainer = new CookieContainer();
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.ContentLength = Encoding.UTF8.GetByteCount(payload);
            webRequest.ContentType = "application/x-www-form-urlencoded";//Content-Type
            webRequest.CookieContainer = cookieContainer;
            webRequest.Method = "post";
            Stream request = webRequest.GetRequestStream();
            StreamWriter streamWriter = new StreamWriter(request, Encoding.GetEncoding("gb2312"));
            streamWriter.Write(payload);
            streamWriter.Close();
            HttpWebResponse response = (HttpWebResponse)webRequest.GetResponse();
            response.Cookies = cookieContainer.GetCookies(response.ResponseUri);
            Stream returnStream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(returnStream, Encoding.GetEncoding("utf-8"));
            string endResult = streamReader.ReadToEnd();//返回结果
            streamReader.Close();
            returnStream.Close();
            return endResult;
        }
        /// <summary>
        /// 快速接入方式
        /// </summary>
        /// <returns></returns>
        private static string CelerityPost()
        {
            string url = "http://openapiai.xueersi.com/v1/api/img/ocr/expreg";//URL地址
            string payload = "app_key=8102b22a5e81e840176d9f381ec6f837&img=http%3A%2F%2Fai.xueersi.com%2ForalCorrection%2Fimages%2FKPI_180.jpg&img_type=URL";
            CookieContainer cookieContainer = new CookieContainer();
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.ContentLength = Encoding.UTF8.GetByteCount(payload);
            webRequest.ContentType = "application/x-www-form-urlencoded";//Content-Type
            webRequest.CookieContainer = cookieContainer;
            webRequest.Method = "post";
            Stream request = webRequest.GetRequestStream();
            StreamWriter streamWriter = new StreamWriter(request, Encoding.GetEncoding("gb2312"));
            streamWriter.Write(payload);
            streamWriter.Close();
            HttpWebResponse response = (HttpWebResponse)webRequest.GetResponse();
            response.Cookies = cookieContainer.GetCookies(response.ResponseUri);
            Stream returnStream = response.GetResponseStream();
            StreamReader streamReader = new StreamReader(returnStream, Encoding.GetEncoding("utf-8"));
            string endResult = streamReader.ReadToEnd();//返回结果
            streamReader.Close();
            returnStream.Close();
            return endResult;
        }
        /// <summary>
        /// 获得签名sign
        /// </summary>
        /// <returns></returns>
        private static string GetSign(string app_key, string app_secret , string times)//获得签名
        {
            string sign = "";
            Dictionary<string, string> dic = new Dictionary<string, string>();


            dic.Add("app_key", app_key);//appkey
            dic.Add("time_stamp", times );
            dic.Add("nonce_str", nonce_str);
            dic.Add("img", base64 );
            dic.Add("img_type", "URL");
            List<string> key = new List<string>();
            key.Add("app_key");
            key.Add("time_stamp");
            key.Add("nonce_str");
            key.Add("img");
            key.Add("img_type");
            key.Sort();
            string str = "";
            foreach (var item in key)
            {
                str += dic[item];
            }
            str += app_secret;// app_secret
            sign = Sha1Signature(str);

            return sign;

        }
        public static string Sha1Signature(string str)
        {
            using (SHA1 sha1 = SHA1.Create())
            {
                byte[] hash = sha1.ComputeHash(Encoding.UTF8.GetBytes(str));
                StringBuilder stringBuilder = new StringBuilder();
                for (int index = 0; index < hash.Length; ++index)
                    stringBuilder.Append(hash[index].ToString("x2"));
                sha1.Clear();
                return stringBuilder.ToString().ToLower();
            }

        }
        public static string Time()
        {
            TimeSpan ts = DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }


    }

}
