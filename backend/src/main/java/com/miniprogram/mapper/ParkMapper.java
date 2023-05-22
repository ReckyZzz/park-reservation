package com.miniprogram.mapper;

import com.miniprogram.pojo.Park;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ParkMapper {
    List<Park> list();

    List<Park> availableList();

    Park getParkById(Integer parkId);

    Integer updatePark(Integer parkId, String parkName, Double longitude, Double latitude, String address
            , Integer maxCapacity, Integer parkCapacity, Double price, String mapId);

    Integer insert(String parkName, Double longitude, Double latitude, String address
            , Integer maxCapacity, Double price);

    Integer reserve(Integer parkId);

    Integer addCapacity(Integer parkId, Integer number);
}
