package com.miniprogram.service;

import com.miniprogram.pojo.Park;
import com.miniprogram.vo.ParkVO;

import java.util.List;

public interface ParkService {
    List<ParkVO> getList();

    List<ParkVO> getAvailableList();

    ParkVO getVoByPark(Park park);

    Park getParKById(Integer parkId);

    Integer updatePark(Integer parkId, String parkName, Double longitude, Double latitude, String address,
                       Integer maxCapacity, Integer parkCapacity, Double price, String mapId);

    Integer insertPark(String parkName, Double longitude, Double latitude, String address
            , Integer maxCapacity, Double price);
}
