package com.flexpro.mobile;

import android.app.Activity;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class PayActivity extends Activity implements OnClickListener, SharedPreferences.OnSharedPreferenceChangeListener {

	public static final String SHARED_PREFS_NAME = "RealEstateSettings";
	
	public static final String	PRELIM_KEY_STYLE_INDEX = "style_index"; // 0 ~ 2
	public static final String	PRELIM_KEY_FONT_INDEX = "font_index"; // 0 ~ 5

	private static final int DIALOG_FONT_SIZE = 1;

	private SharedPreferences mPrefs = null;

	private Button btn_back = null;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        overridePendingTransition(R.anim.slide_in_up, R.anim.slide_none);
        setContentView(R.layout.setting_view);
        
        //mPrefs = PreferenceManager.getDefaultSharedPreferences(this);
        mPrefs = this.getSharedPreferences(SHARED_PREFS_NAME, 0);
        mPrefs.registerOnSharedPreferenceChangeListener(this);
        
        btn_back = (Button)findViewById(R.id.btn_setting_back);
        btn_back.setOnClickListener(this);
                
    }

    @Override
	public void onResume() {
		super.onResume();
		changeStyle(mPrefs.getInt(PRELIM_KEY_STYLE_INDEX, 1));		
	}
    
	@Override
	protected void onDestroy() {
		mPrefs.unregisterOnSharedPreferenceChangeListener(this);
		super.onDestroy();
	}

	@Override
	public void onBackPressed() {
		super.onBackPressed();
		overridePendingTransition(R.anim.slide_none, R.anim.slide_out_bottom);
	}

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.btn_setting_back:
			finish();
			overridePendingTransition(R.anim.slide_none, R.anim.slide_out_bottom);
			break;
		
		default:
		}
		
	}

	@Override
	public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
		if(key.equals(PRELIM_KEY_FONT_INDEX)) {
		} else if(key.equals(PRELIM_KEY_STYLE_INDEX)) {
			changeStyle(mPrefs.getInt(PRELIM_KEY_STYLE_INDEX, 1));
		}
		
	}
	
	public void changeStyle(int style) {
//		switch(style) {
//		case 0:
//			view_banner.setBackgroundResource(R.drawable.banner1);
//			btn_back.setBackgroundResource(R.drawable.back_button_1);
//			break;
//		case 1:
//			view_banner.setBackgroundResource(R.drawable.banner2);
//			btn_back.setBackgroundResource(R.drawable.back_button_2);
//			break;
//		case 2:
//			view_banner.setBackgroundResource(R.drawable.banner3);
//			btn_back.setBackgroundResource(R.drawable.back_button_3);
//			break;
//		}
	}
	
}