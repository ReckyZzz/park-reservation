package com.miniprogram.mapper;

import com.miniprogram.pojo.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    List<User> list();

    Integer insert(String openId);

    Integer updateLocation(String openId, Double latitude, Double longitude);

    Integer bindCar(String openId, String carId);

    Integer unbindCar(String openId);

    String getCarByUser(String openId);
}
