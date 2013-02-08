package com.flexpro.mobile;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.IPlugin;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

//public class FlexProMobileActivity extends DroidGap {
//  @Override
//  public void onCreate(Bundle savedInstanceState) {
//      super.onCreate(savedInstanceState);
//      super.loadUrl("file:///android_asset/www/index.html");
//      super.setIntegerProperty("loadUrlTimeoutValue", 60000);
//  }
//	
//}

public class FlexProMobileActivity extends Activity implements CordovaInterface {
    CordovaWebView cwv;
    /* Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.flexpro_view);
        cwv = (CordovaWebView) findViewById(R.id.FlexProView);
        cwv.loadUrl("file:///android_asset/www/index.html");
    }
	@Override
	@Deprecated
	public void cancelLoadUrl() {
		// TODO Auto-generated method stub
		
	}
	@Override
	public Activity getActivity() {
		// TODO Auto-generated method stub
		return this;
	}
	@Override
	@Deprecated
	public Context getContext() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Object onMessage(String arg0, Object arg1) {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public void setActivityResultCallback(IPlugin arg0) {
		// TODO Auto-generated method stub
		
	}
	@Override
	public void startActivityForResult(IPlugin arg0, Intent arg1, int arg2) {
		// TODO Auto-generated method stub
		
	}
//	@Override
//	public void onDestroy() {
//	  super.onDestroy();
//
//	  if (this.cwv != null) {
//		this.cwv.removeAllViews();
//	    this.cwv.destroy();
//	  }
//	}
}
