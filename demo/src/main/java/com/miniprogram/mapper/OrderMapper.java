package com.miniprogram.mapper;

import com.miniprogram.pojo.Order;
import org.apache.ibatis.annotations.Mapper;

import java.util.Date;
import java.util.List;

@Mapper
public interface OrderMapper {
    Order getOrderById(Integer orderId);
    Order hasOrderHereToday(String openId,Integer parkId,Date today);
    Order getOrderToday(String openId,Date today);
    List<Order> getOrdersByUser(String openId);
    List<Order> getOrdersToday(Integer parkId,Date today);
    Integer insert(String openId, String carId, String modelId, Integer parkId, Double cordX, Double cordY,
                   String spaceName, Date reserveTime);
    Integer resetOrders(Integer parkId,Date today);
    Integer cancelOrder(Integer orderId);
    Integer setInTime(Integer orderId,Date inTime);
    Integer setOutTime(Integer orderId,Date outTime);
    Integer setCost(Integer orderId,Double cost);
}
