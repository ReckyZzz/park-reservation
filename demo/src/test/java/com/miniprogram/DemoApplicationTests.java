package com.miniprogram;

import com.miniprogram.mapper.OrderMapper;
import com.miniprogram.mapper.ParkMapper;
import com.miniprogram.mapper.UserMapper;
import com.miniprogram.pojo.Order;
import com.miniprogram.pojo.Park;
import com.miniprogram.pojo.User;
import com.miniprogram.service.OrderService;
import net.sf.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@SpringBootTest
class DemoApplicationTests {
    @Resource
    UserMapper userMapper;
    @Resource
    ParkMapper parkMapper;
    @Resource
    OrderMapper orderMapper;
    @Resource
    OrderService orderService;
    @Test
    void testUser(){
        /*List<User> users = userMapper.list();
        for(User u:users){
            System.out.print(u.getOpenId() + "  ");
            System.out.println(u.getCarId()  + "  ");
        }*/
        //userMapper.insert("123");
        //userMapper.updateLocation("oeB3N5bYM8kZbTKSJm4q02rktiVw", 134.2 ,123.123);
    }
    @Test
    void testPark(){
        /*List<Park> parks = parkMapper.list();
        for(Park p:parks){
            System.out.printf(p.getMapId());
        }*/
        /*Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);//将Date设为20xx-xx-xx 00:00:00 以便查询今日之后的订单
        calendar.set(Calendar.HOUR_OF_DAY,0);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);
        today = calendar.getTime();
        System.out.printf(today.toString());*/
    }

    @Test
    void testService(){
        /*int num = orderService.resetOrders();
        System.out.print(num);*/
        Order order = orderMapper.getOrderById(27);
        Park park = parkMapper.getParkById(order.getParkId());
        Double price = 0.0;
        Calendar start = Calendar.getInstance();
        start.setTime(order.getInTime());
        Calendar end = Calendar.getInstance();
        end.setTime(order.getOutTime());
        long result = end.getTimeInMillis() - start.getTimeInMillis();
        int minute =(int)Math.ceil(result/1000.0/60.0);
        if(minute < 15){
            price = 0.0;
        }
        else if(minute <= 60){
            //超过15分钟 不到一小时向上取整
            price = Math.ceil(minute / 60.0) * park.getPrice();
        }
        else{
            price = Math.round(minute / 60.0) * park.getPrice();
        }
        System.out.println(price);
    }
}
