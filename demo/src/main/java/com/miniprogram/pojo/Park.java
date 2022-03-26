package com.miniprogram.pojo;

import lombok.Data;

@Data
public class Park {
    private Integer parkId;
    private String parkName;
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer parkCapacity;
    private Integer maxCapacity;
    private Double price;
    private String mapId;
}
