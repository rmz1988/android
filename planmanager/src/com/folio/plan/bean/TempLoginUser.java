package com.folio.plan.bean;

import java.io.Serializable;

/**
 * @author lichen
 */
public class TempLoginUser implements Serializable {

	private static final long serialVersionUID = -1245056872921255343L;

	private String username = "";
	private String password = "";
	private boolean autoLogin;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public boolean isAutoLogin() {
		return autoLogin;
	}

	public void setAutoLogin(boolean autoLogin) {
		this.autoLogin = autoLogin;
	}
}
