package com.folio.plan.bean;

import java.io.Serializable;

/**
 * @author lichen
 */
public class AddressConf implements Serializable {

	private static final long serialVersionUID = -5384722083401921541L;

	private int id;
	private String name;
	private String address;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
