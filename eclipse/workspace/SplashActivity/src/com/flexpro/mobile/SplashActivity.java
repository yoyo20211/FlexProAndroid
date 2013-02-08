package com.flexpro.mobile;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

public class SplashActivity extends Activity {
	
	private static final int SPLASH_DISPLAY_TIME = 3000;
	
    @Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.splash);

    	Handler handler = new Handler() {
    		@Override
    		public void handleMessage(Message msg) {
				finish();
				SplashActivity.this.startActivity(new Intent(SplashActivity.this, FlexProMobileActivity.class));
	        }
	    };
        handler.sendEmptyMessageDelayed(0, SPLASH_DISPLAY_TIME); // ms, after 1s

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
    
}

