package com.miniprogram.controller;

import com.miniprogram.pojo.User;
import com.miniprogram.response.CommonResponse;
import com.miniprogram.service.UserService;
import com.miniprogram.util.HttpUtil;
import com.miniprogram.configure.Miniprogram;
import net.sf.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Resource
    UserService userService;

    @RequestMapping("/login")
    public Map<String, String> login(HttpServletRequest request, String code, String nickName) {
        String result = "";
        String openId = "";
        Map<String, String> res = new HashMap();
        Miniprogram miniprogram = new Miniprogram();
        try {
            result = HttpUtil.doGet(
                    "https://api.weixin.qq.com/sns/jscode2session?appid="
                            + miniprogram.appId + "&secret="
                            + miniprogram.appSecret + "&js_code="
                            + code
                            + "&grant_type=authorization_code", null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        JSONObject jsonObject = JSONObject.fromObject(result);
        openId = jsonObject.get("openid").toString();
        res.put("openid", openId);
        //res.put("session_key",jsonObject.get("session_key").toString());
        //根据openid判断用户是否注册
        User user = userService.checkUserRegister(openId);
        if (user == null) {//未注册
            userService.register(openId);
        } else {//已注册

        }
        return res;
    }

    @RequestMapping("setLocation")
    public CommonResponse<Double> setLocation(String openId, Double latitude, Double longitude) {
        int result = userService.updateLocation(openId, latitude, longitude);
        if (result != -1) {
            return new CommonResponse<>(0, "更新位置成功", null);
        }
        return new CommonResponse<>(1, "更新位置失败", null);
    }

    @RequestMapping("bindCar")
    public CommonResponse<String> bindCar(String openId, String carId) {
        userService.bindCar(openId, carId);
        return new CommonResponse<>(0, "绑定成功", null);
    }

    @RequestMapping("unbindCar")
    public CommonResponse<String> unbindCar(String openId) {
        userService.unbindCar(openId);
        return new CommonResponse<>(0, "解绑成功", null);
    }

    @RequestMapping("getCarId")
    public CommonResponse<String> getCarId(String openId) {
        String carId = userService.getCarId(openId);
        if (carId == null) {
            return new CommonResponse<>(1, "用户未绑定车牌", null);
        } else {
            return new CommonResponse<>(0, "用户已绑定车牌", carId);
        }
    }
}
