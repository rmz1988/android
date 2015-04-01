package com.folio.plan.utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Handler;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.folio.plan.activity.R;
import com.folio.plan.bean.AddressConf;
import com.folio.plan.bean.LoginUser;
import com.folio.plan.bean.TempLoginUser;
import com.folio.plan.db.DatabaseHelper;

/**
 * 软件设置工具
 *
 * @author lichen
 */
public class ConfigUtils {

	private static TempLoginUser tempLoginUser = new TempLoginUser();
	private static ProgressDialog dialog;

	private DatabaseHelper dbHelper;
	private ObjectMapper mapper = new ObjectMapper();
	private Handler handler = new Handler();
	private Context context;

	public ConfigUtils(Activity main) {
		context = main;
		dbHelper = new DatabaseHelper(main);
	}

	@JavascriptInterface
	public String getTempLoginUser() throws Exception {
		return mapper.writeValueAsString(tempLoginUser);
	}

	@JavascriptInterface
	public void setTempLoginUser(final String username, final String password) {
		handler.post(new Runnable() {

			@Override
			public void run() {
				tempLoginUser.setUsername(username);
				tempLoginUser.setPassword(password);
			}
		});

	}

	/**
	 * 查询登录用户
	 */
	@JavascriptInterface
	public String getLoginUser() throws Exception {
		String result = null;
		SQLiteDatabase db = dbHelper.getReadableDatabase();
		Cursor cursor = db.query("login_user",
				new String[]{"number", "code", "user", "name", "root", "rootname", "department", "position", "depname",
						"posname", "power", "key",}, null, null, null, null, null);
		if (cursor.moveToNext()) {
			LoginUser loginUser = new LoginUser();
			loginUser.setNumber(cursor.getString(cursor.getColumnIndex("number")));
			loginUser.setCode(cursor.getString(cursor.getColumnIndex("code")));
			loginUser.setUser(cursor.getString(cursor.getColumnIndex("user")));
			loginUser.setName(cursor.getString(cursor.getColumnIndex("name")));
			loginUser.setRoot(cursor.getString(cursor.getColumnIndex("root")));
			loginUser.setRootname(cursor.getString(cursor.getColumnIndex("rootname")));
			loginUser.setDepartment(cursor.getString(cursor.getColumnIndex("department")));
			loginUser.setPosition(cursor.getString(cursor.getColumnIndex("position")));
			loginUser.setDepname(cursor.getString(cursor.getColumnIndex("depname")));
			loginUser.setPosname(cursor.getString(cursor.getColumnIndex("posname")));
			loginUser.setPower(cursor.getString(cursor.getColumnIndex("power")));
			loginUser.setKey(cursor.getString(cursor.getColumnIndex("key")));

			result = mapper.writeValueAsString(loginUser);
		}
		cursor.close();
		db.close();

		return result;
	}

	/**
	 * 查询配置地址列表
	 */
	@JavascriptInterface
	public String getAddress() throws Exception {
		String result = null;
		SQLiteDatabase db = dbHelper.getReadableDatabase();
		Cursor cursor = db.query("address_conf", new String[]{"name", "address"}, null, null, null, null, null);
		AddressConf addressConf;
		if (cursor.moveToNext()) {
			addressConf = new AddressConf();
			addressConf.setName(cursor.getString(cursor.getColumnIndex("name")));
			addressConf.setAddress(cursor.getString(cursor.getColumnIndex("address")));
			result = mapper.writeValueAsString(addressConf);
		}

		return result;
	}

	@JavascriptInterface
	public void saveLoginUser(final String number, final String code, final String user, final String name,
	                          final String root, final String rootname, final String department, final String position,
	                          final String depname, final String posname, final String power, final String key) {
		handler.post(new Runnable() {

			@Override
			public void run() {
				SQLiteDatabase db = dbHelper.getWritableDatabase();
				db.execSQL("delete from login_user");

				ContentValues values = new ContentValues();
				values.put("number", number);
				values.put("code", code);
				values.put("user", user);
				values.put("name", name);
				values.put("root", root);
				values.put("rootname", rootname);
				values.put("department", department);
				values.put("position", position);
				values.put("depname", depname);
				values.put("posname", posname);
				values.put("power", power);
				values.put("key", key);

				db.insert("login_user", null, values);
				db.close();
			}
		});

	}

	@JavascriptInterface
	public void saveAddress(final String name, final String address) {
		handler.post(new Runnable() {

			@Override
			public void run() {
				SQLiteDatabase db = dbHelper.getWritableDatabase();
				db.execSQL("delete from address_conf");

				ContentValues values = new ContentValues();
				values.put("name", name);
				values.put("address", address);
				db.insert("address_conf", null, values);
				db.close();
			}
		});
	}

	@JavascriptInterface
	public void loginFailed() {
		handler.post(new Runnable() {

			@Override
			public void run() {
				dismissDialog();

				AlertDialog.Builder builder = new AlertDialog.Builder(context);
				AlertDialog dialog =
						builder.setTitle(R.string.attention).setMessage(R.string.login_failed)
								.setPositiveButton(R.string.confirm, null).create();
				dialog.show();
			}
		});
	}

	@JavascriptInterface
	public void exit() {
		handler.post(new Runnable() {

			@Override
			public void run() {
				AlertDialog.Builder builder = new AlertDialog.Builder(context);
				AlertDialog dialog =
						builder.setTitle(R.string.attention).setMessage(R.string.exit_tip)
								.setPositiveButton(R.string.confirm,
										new DialogInterface.OnClickListener() {

											@Override
											public void onClick(DialogInterface dialogInterface, int i) {
												System.exit(0);
											}
										}).setNegativeButton(R.string.cancel, null).create();
				dialog.show();
			}
		});
	}

	@JavascriptInterface
	public void login() {
		handler.post(new Runnable() {

			@Override
			public void run() {
				dialog = new ProgressDialog(context);
				dialog.setCancelable(false);
				dialog.setMessage("登录中...");
				dialog.show();
			}
		});
	}

	@JavascriptInterface
	public void dismissDialog() {
		if (dialog != null && dialog.isShowing()) {
			dialog.dismiss();
			dialog = null;
		}
	}

	@JavascriptInterface
	public void saving() {
		handler.post(new Runnable() {

			@Override
			public void run() {
				dialog = new ProgressDialog(context);
				dialog.setCancelable(false);
				dialog.setMessage("计划提交中...");
				dialog.show();
			}
		});
	}

	@JavascriptInterface
	public void saveSuccess() {
		dismissDialog();
		Toast.makeText(context, "计划提交成功", Toast.LENGTH_SHORT).show();
	}

	@JavascriptInterface
	public void saveFailed() {
		dismissDialog();
		Toast.makeText(context, "系统繁忙，请稍后重试", Toast.LENGTH_SHORT).show();
	}
}
