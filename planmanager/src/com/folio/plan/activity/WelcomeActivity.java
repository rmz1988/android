package com.folio.plan.activity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Window;
import android.view.WindowManager;

/**
 * 欢迎页
 *
 * @author lichen
 */
public class WelcomeActivity extends Activity {

	private Handler handler = new Handler();

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

		setContentView(R.layout.welcome);

		//2s后进入主页
		handler.postDelayed(new Runnable() {

			@Override
			public void run() {
				Intent intent = new Intent();
				intent.setClass(WelcomeActivity.this, MainActivity.class);
				startActivity(intent);
				overridePendingTransition(R.anim.bottom_in, R.anim.top_out);
				WelcomeActivity.this.finish();
			}
		}, 2000L);
	}
}