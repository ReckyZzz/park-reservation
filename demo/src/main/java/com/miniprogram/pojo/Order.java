package com.miniprogram.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Order {
    private Integer orderId;
    private String openId;
    private String carId;
    private String modelId;
    private Integer parkId;
    private Double cordX;
    private Double cordY;
    private String spaceName;
    private Date reserveTime;
    private Date inTime;
    private Date outTime;
    private Double cost;
    private Integer status;//0为待使用 1为使用中 2为已完成 3为已取消
}
