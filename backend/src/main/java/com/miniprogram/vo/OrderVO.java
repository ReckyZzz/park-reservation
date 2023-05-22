package com.miniprogram.vo;

import lombok.Data;

import java.util.Date;

@Data
public class OrderVO {
    private Integer orderId;
    private String openId;
    private String carId;
    private String modelId;
    private Integer parkId;
    private String parkName;
    private Double cordX;
    private Double cordY;
    private String spaceName;
    private Date reserveTime;
    private String reserveTimeString;
    private Date inTime;
    private String inTimeString;
    private Date outTime;
    private String outTimeString;
    private Double cost;
    private Integer status;//0为待使用 1为使用中 2为已完成 3为已取消
    private String statusString;
}
