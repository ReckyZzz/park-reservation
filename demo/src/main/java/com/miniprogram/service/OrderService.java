package com.miniprogram.service;

import com.miniprogram.pojo.Order;
import com.miniprogram.vo.OrderVO;

import java.util.Date;
import java.util.List;

public interface OrderService {
    List<OrderVO> getOrdersByUser(String openId);//用户
    List<Order> getOrdersToday(Integer parkId);//停车场
    Order getOrderHereToday(String openId,Integer parkId);//用户及停车场
    Order getOrderToday(String openId);
    OrderVO getOrderVOById(Integer orderId);
    Integer insert(String openId, String carId, String modelId, Integer parkId, Double cordX, Double cordY,
                   String spaceName, Date reserveTime);
    Integer resetOrders();
    Integer cancelOrder(Integer orderId);
    Integer getIn(Integer orderId,Date inTime);
    Double getOut(Integer orderId,Date outTime);
}
