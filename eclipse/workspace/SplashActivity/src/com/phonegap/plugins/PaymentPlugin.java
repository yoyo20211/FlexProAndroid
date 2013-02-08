package com.phonegap.plugins;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;

import android.content.Intent;

import com.flexpro.mobile.PayActivity;

public class PaymentPlugin extends Plugin{
    protected static final String LOG_TAG = "ChildBrowser";
	
	@Override
	public PluginResult execute(String arg0, JSONArray arg1, String arg2) {
		final String userId = arg2;
		
	       // Create dialog in new thread
        Runnable runnable = new Runnable() {
            public void run() {
            	cordova.getActivity().startActivity(new Intent(cordova.getActivity(), PayActivity.class));
            }
        };
        this.cordova.getActivity().runOnUiThread(runnable);
		return new PluginResult(PluginResult.Status.OK, "Success :)");
	}

}
