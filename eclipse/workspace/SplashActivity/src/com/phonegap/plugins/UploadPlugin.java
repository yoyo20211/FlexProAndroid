package com.phonegap.plugins;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Intent;

import com.flexpro.mobile.UploadActivity;
import com.flexpro.mobile.common.Constants;

public class UploadPlugin extends Plugin{
    protected static final String LOG_TAG = "ChildBrowser";
	
	@Override
	public PluginResult execute(String arg0, JSONArray arg1, String arg2) {
		try {
			String userId = arg1.getString(0);
			Constants.CUSTOMER_ID = userId;
		} catch (JSONException e) {
			e.printStackTrace();
		}		
		
	    // Create dialog in new thread
        Runnable runnable = new Runnable() {
            public void run() {
            	cordova.getActivity().startActivity(new Intent(cordova.getActivity(), UploadActivity.class));
            }
        };
        this.cordova.getActivity().runOnUiThread(runnable);
		return new PluginResult(PluginResult.Status.OK, "Success :)");
	}

}
