package com.folio.plan.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * @author lichen
 */
public class DatabaseHelper extends SQLiteOpenHelper {

	private static final String DB_NAME = "folioDb";
	private static final int DB_VERSION = 1;

	public DatabaseHelper(Context context) {
		super(context, DB_NAME, null, DB_VERSION);
	}

	@Override
	public void onCreate(SQLiteDatabase sqLiteDatabase) {
		sqLiteDatabase.execSQL(
				"create table if not exists login_user(" +
						"id integer primary key autoincrement," +
						"number text," +
						"code text," +
						"user text," +
						"name text," +
						"root text," +
						"rootname text," +
						"department text," +
						"position text," +
						"depname text," +
						"posname text," +
						"power text," +
						"key text)");
		sqLiteDatabase.execSQL(
				"create table if not exists address_conf(id integer primary key autoincrement,address text)");
	}

	@Override
	public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
		onCreate(sqLiteDatabase);
	}
}
