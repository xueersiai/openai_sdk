package com.tal.speech.taltest;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by os on 2019/3/20.
 */

public class OCRConnect {
    private static String TAG="OCRConnect";

    public static String getSha1(String str) {

        char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f' };
        try {
            MessageDigest mdTemp = MessageDigest.getInstance("SHA1");
            mdTemp.update(str.getBytes("UTF-8"));
            byte[] md = mdTemp.digest();
            int j = md.length;
            char buf[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                buf[k++] = hexDigits[byte0 >>> 4 & 0xf];
                buf[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(buf);
        } catch (Exception e) {
            return null;
        }
    }

    public static String Bitmap2StrByBase64(Bitmap bit) {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        bit.compress(Bitmap.CompressFormat.JPEG, 40, bos);//参数100表示不压缩
        byte[] bytes = bos.toByteArray();
        return Base64.encodeToString(bytes, Base64.DEFAULT);

    }

    private static String getReqSign(Map<String,String> m, String appsec)
    {

        Collection<String> keyset= m.keySet();
        List list=new ArrayList<String>(keyset);
        //排序
        Collections.sort(list);

        //拼接
        String buffer = "";
        for(int i=0;i<list.size();i++){
            buffer=buffer+m.get(list.get(i));
        }

        buffer=buffer+appsec;

        //加密
        return getSha1(buffer);
    }

    public static void SafeConnect(){

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put("app_key", app_key);
                    long t1=System.currentTimeMillis();
                    params.put("time_stamp",t1+"");
                    params.put("nonce_str","fa577ce340859f9fe");
                    
                    String sign=getReqSign(params,appsec);
                    Log.i(TAG,"sign="+sign);
                    params.put("sign",sign);
                    
                    FileInputStream fis = new FileInputStream("/sdcard/1.png");
                    Bitmap bitmap  = BitmapFactory.decodeStream(fis);
                    String bitmap64=Bitmap2StrByBase64(bitmap);
                    params.put("img",bitmap64);
                    params.put("img_type","BASE64");

                    Log.i(TAG,"start post");
                    String result = HttpUtil.sendPostMessage(params,"utf-8");
                    System.out.println("result->"+result);

                }catch(Exception e)
                {
                    e.printStackTrace();
                }
            }
        }).start();


    }

    public static void QuickConnect(){

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Map<String, String> params = new HashMap<String, String>();
                    params.put("app_key",app_key);

                    FileInputStream fis = new FileInputStream("/sdcard/1.png");
                    Bitmap bitmap  = BitmapFactory.decodeStream(fis);
                    String bitmap64=Bitmap2StrByBase64(bitmap);
                    params.put("img",bitmap64);
                    params.put("img_type","BASE64");

                    Log.i(TAG,"start post");
                    String result = HttpUtil.sendPostMessage(params,"utf-8");
                    System.out.println("result->"+result);

                }catch(Exception e)
                {
                    e.printStackTrace();
                }
            }
        }).start();


    }
}
