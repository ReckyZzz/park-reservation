package com.miniprogram.pojo;

import lombok.Data;

@Data
public class User {
    private String openId;
    private String carId;
    private Double longitude;
    private Double latitude;
}
