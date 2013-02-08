package com.flexpro.mobile;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.ByteArrayBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;

import com.flexpro.mobile.common.Constants;

public class UploadActivity extends Activity implements OnClickListener {
	private static final int ACTION_CAMERA_PHOTO = 0;
	private static final int ACTION_GALLARY_PHOTO = 1;

	private Button btn_back = null;
	private Button btn_select = null;
	private Button btn_take = null;
	private Button btn_upload = null;
	private ImageView img_view = null;
	
	Bitmap m_captureImage = null;
	Uri m_selectedImage = null;

	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.upload_view);
        
        img_view = (ImageView)findViewById(R.id.id_image_view);

        btn_back = (Button)findViewById(R.id.id_back_btn);
        btn_back.setOnClickListener(this);

        btn_select = (Button)findViewById(R.id.id_select_img_btn);
        btn_select.setOnClickListener(this);

        btn_take = (Button)findViewById(R.id.id_take_img_btn);
        btn_take.setOnClickListener(this);

        btn_upload = (Button)findViewById(R.id.id_upload_img_btn);
        btn_upload.setOnClickListener(this);
	}

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.id_back_btn:
			finish();
			overridePendingTransition(R.anim.slide_none, R.anim.slide_out_bottom);
			break;
		case R.id.id_select_img_btn:
			showSelectImageDialog();
			break;
		case R.id.id_take_img_btn:
			showTakeImageDialog();
			break;
		case R.id.id_upload_img_btn:
			uploadImage();
			break;
		}
	}
	
	void showSelectImageDialog() {
		Intent pickPhoto = new Intent(Intent.ACTION_PICK,
		           android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
		startActivityForResult(pickPhoto , 1);
	}

	void showTakeImageDialog() {
		Intent takePicture = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
		startActivityForResult(takePicture, ACTION_CAMERA_PHOTO);
	}
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		switch (requestCode) {
		case ACTION_CAMERA_PHOTO:
		    if(resultCode == RESULT_OK){  
		    	m_captureImage = (Bitmap) data.getExtras().get("data");
		        img_view.setImageBitmap(m_captureImage);
		        m_selectedImage = null;
		    }
		    break;
		case ACTION_GALLARY_PHOTO:
		    if(resultCode == RESULT_OK){  
		    	m_selectedImage = data.getData();
		        img_view.setImageURI(m_selectedImage);
		        m_captureImage = null;
		    }
		break;
		}
	}
	
	private void uploadImage() {
		if (m_selectedImage != null) {
	        List<NameValuePair> params = new ArrayList<NameValuePair>(1);
	        params.add(new BasicNameValuePair("base64Image", m_selectedImage.getPath()));
	        params.add(new BasicNameValuePair("customerId", Constants.CUSTOMER_ID));
	        post("http://www.flexprocrm.com/Api/UploadImage",params);

			showMessageBox("Upload Image", "Upload image successful!");
	        return;
		}
		
		if (m_captureImage != null) {
			executeMultipartPost("http://www.flexprocrm.com/Api/UploadImage");
			showMessageBox("Upload Image", "Upload image successful!");
			return;
		}
    }
	
	public void post(String url, List<NameValuePair> nameValuePairs) {
	    HttpClient httpClient = new DefaultHttpClient();
	    HttpContext localContext = new BasicHttpContext();
	    HttpPost httpPost = new HttpPost(url);

	    try {
	        MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);

	        for(int index = 0; index < nameValuePairs.size(); index++) {
	            if(nameValuePairs.get(index).getName().equalsIgnoreCase("base64Image")) {
	                // If the key equals to "image", we use FileBody to transfer the data
	                entity.addPart(nameValuePairs.get(index).getName(), new FileBody(new File (nameValuePairs.get(index).getValue())));
	            } else {
	                // Normal string data
	                entity.addPart(nameValuePairs.get(index).getName(), new StringBody(nameValuePairs.get(index).getValue()));
	            }
	        }

	        httpPost.setEntity(entity);

	        HttpResponse response = httpClient.execute(httpPost, localContext);
	    } catch (IOException e) {
	        e.printStackTrace();
	    }
	}
	
	public void executeMultipartPost(String strURL) {
		try {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			m_captureImage.compress(CompressFormat.PNG, 100, bos);
			byte[] data = bos.toByteArray();
			
			HttpClient httpClient = new DefaultHttpClient();
			HttpPost postRequest = new HttpPost(strURL);
			ByteArrayBody bab = new ByteArrayBody(data, "device.jpg");
			
			// File file= new File(“/mnt/sdcard/forest.png”);
			// FileBody bin = new FileBody(file);
			MultipartEntity reqEntity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);
			reqEntity.addPart("base64Image", bab);
			reqEntity.addPart("customerId", new StringBody(Constants.CUSTOMER_ID));
			postRequest.setEntity(reqEntity);
			HttpResponse response = httpClient.execute(postRequest);
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent(), "UTF-8"));
			String sResponse;
			StringBuilder s = new StringBuilder();
	
			while ((sResponse = reader.readLine()) != null) {
				s = s.append(sResponse);
			}
			System.out.println("Response:—————————————————————————————————————————-> " + s);
		} catch (Exception e) {
		// handle exception here
			Log.e(e.getClass().getName(), e.getMessage());
		}
	}
	
	public void showMessageBox(String strTitle,String strMessage)
	{
	    AlertDialog.Builder dlgAlert  = new AlertDialog.Builder(this);                      
	    dlgAlert.setTitle(strTitle); 
	    dlgAlert.setMessage(strMessage); 
	    dlgAlert.setPositiveButton("OK",new DialogInterface.OnClickListener() {
	        public void onClick(DialogInterface dialog, int whichButton) {
	             finish(); 
	        }
	   });
	    dlgAlert.setCancelable(true);
	    dlgAlert.create().show();
	}
}
