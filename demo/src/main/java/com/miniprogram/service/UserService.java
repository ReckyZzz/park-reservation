package com.miniprogram.service;

import com.miniprogram.pojo.User;

public interface UserService {
    User checkUserRegister(String openId);
    Integer register(String openId);
    Integer updateLocation(String openId,Double latitude,Double longitude);
    Integer bindCar(String openId,String carId);
    Integer unbindCar(String openId);
    String getCarId(String openId);
}
