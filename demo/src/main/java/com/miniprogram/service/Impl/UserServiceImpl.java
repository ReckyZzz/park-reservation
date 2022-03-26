package com.miniprogram.service.Impl;

import com.miniprogram.mapper.UserMapper;
import com.miniprogram.pojo.User;
import com.miniprogram.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    UserMapper userMapper;

    @Override
    public User checkUserRegister(String openId){
        User user = null;
        List<User> users = userMapper.list();
        for(User u:users){
            if(u.getOpenId().equals(openId)){
                user = u;
                break;
            }
        }
        return user;
    }

    @Override
    public Integer register(String openId){
        return userMapper.insert(openId);
    }

    @Override
    public Integer updateLocation(String openId,Double latitude,Double longitude){
        List<User> users = userMapper.list();
        for(User u:users){
            if(u.getOpenId().equals(openId)){
                break;
            }
        }
        if(openId == null){
            return -1;
        }
        if(latitude != null && longitude != null){//传入的数据不为空 进行更新
            return userMapper.updateLocation(openId,latitude,longitude);
        }
        return -1;
    }

    @Override
    public Integer bindCar(String openId,String carId){
        return userMapper.bindCar(openId,carId);
    }

    @Override
    public Integer unbindCar(String openId){
        return userMapper.unbindCar(openId);
    }

    @Override
    public String getCarId(String openId){
        return userMapper.getCarByUser(openId);
    }
}
