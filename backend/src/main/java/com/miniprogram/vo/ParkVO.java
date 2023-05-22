package com.miniprogram.vo;

import lombok.Data;

@Data
public class ParkVO {
    private Integer parkId;
    private String parkName;
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer parkCapacity;
    private Integer maxCapacity;
    private Integer distance;
    private Double price;
    private String mapId;
}
