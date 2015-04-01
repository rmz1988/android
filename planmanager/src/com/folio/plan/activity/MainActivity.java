package com.folio.plan.activity;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.folio.plan.utils.ConfigUtils;

import java.lang.reflect.Method;

public class MainActivity extends Activity {

	private WebView mainView;

	/**
	 * Called when the activity is first created.
	 */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.main);

		mainView = (WebView) findViewById(R.id.mainView);
		WebSettings settings = mainView.getSettings();
		settings.setJavaScriptEnabled(true);
		settings.setJavaScriptCanOpenWindowsAutomatically(true);
		settings.setPluginState(WebSettings.PluginState.ON);
		settings.setDefaultZoom(WebSettings.ZoomDensity.FAR);
		settings.setAllowContentAccess(true);
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
			settings.setAllowUniversalAccessFromFileURLs(true);
		}

		if (Build.VERSION.SDK_INT < 16) {
			try {
				Class<?> clazz = settings.getClass();
				Method method = clazz.getMethod("setAllowUniversalAccessFromFileURLs", boolean.class);
				if (method != null) {
					method.invoke(settings, true);
				}
			} catch (Exception e) {
				Log.e("main", "Settings error");
			}
		}

		mainView.loadUrl("file:///android_asset/html/login.html");
		mainView.addJavascriptInterface(new ConfigUtils(this), "android");
		mainView.setSaveEnabled(false);
		mainView.setWebViewClient(new WebViewClient() {

			@Override
			public boolean shouldOverrideUrlLoading(WebView view, String url) {
				view.loadUrl(url);
				return true;
			}
		});
		mainView.setWebChromeClient(new WebChromeClient());

	}

	@Override
	public void onBackPressed() {
		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		AlertDialog dialog =
				builder.setTitle(R.string.attention).setMessage(R.string.exit_tip).setPositiveButton(R.string.confirm,
						new DialogInterface.OnClickListener() {

							@Override
							public void onClick(DialogInterface dialogInterface, int i) {
								System.exit(0);
							}
						}).setNegativeButton(R.string.cancel, null).create();
		dialog.show();
	}

}
