package com.miniprogram.controller;

import com.miniprogram.pojo.Order;
import com.miniprogram.response.CommonResponse;
import com.miniprogram.service.OrderService;
import com.miniprogram.vo.OrderVO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@RestController
public class OrderController {
    @Resource
    OrderService orderService;

    //获取用户所有订单
    @RequestMapping("/getOrdersByUser")
    public CommonResponse<List<OrderVO>> getOrdersByUser(String openId) {
        List<OrderVO> vos = orderService.getOrdersByUser(openId);
        if (vos.size() == 0) {
            return new CommonResponse<>(1, "该用户没有订单", null);
        }
        return new CommonResponse<>(0, "用户订单查询成功", vos);
    }

    //根据ID获取某一订单
    @RequestMapping("/getOrderById")
    public CommonResponse<OrderVO> getOrderById(Integer orderId) {
        OrderVO order = orderService.getOrderVOById(orderId);
        return new CommonResponse<>(0, "订单获取成功", order);
    }

    /***
     获取用户今日订单 使用场景：用户已经预定车位，进入停车场列表时判断是哪个停车场的订单
     目的：防止用户在已有订单的情况下 预定其他停车场的车位
     */
    @RequestMapping("/getOrderToday")
    public CommonResponse<Order> getOrderToday(String openId) {
        Order order = orderService.getOrderToday(openId);
        if (order == null) {
            return new CommonResponse<>(1, "用户今日暂无订单", null);
        } else {
            return new CommonResponse<>(0, "用户今日已有订单", order);
        }
    }

    /***
     判断用户今日在指定停车场有无订单 使用场景：预定之后返回详情界面，显示车位路线按钮
     目的：用户预定车位以后，返回详情能点击按钮查看车位路线
     */
    @RequestMapping("/getOrderHereToday")
    public CommonResponse<Order> getOrderHereToday(String openId, Integer parkId) {
        Order order = orderService.getOrderHereToday(openId, parkId);
        if (order == null) {
            return new CommonResponse<>(1, "该用户今日暂无订单", null);
        } else {
            return new CommonResponse<>(0, "该用户今日已有订单", order);
        }
    }

    //获得停车场的今日订单
    @RequestMapping("/getOrdersToday")
    public CommonResponse<List<Order>> getOrdersToday(Integer parkId) {
        List<Order> orders = orderService.getOrdersToday(parkId);
        if (orders.size() == 0) {
            return new CommonResponse<>(1, "今日暂无订单", null);
        }
        return new CommonResponse<>(0, "获取成功", orders);
    }

    //预定车位
    @RequestMapping("/newOrder")
    public CommonResponse<String> newOrder(String openId, String carId, String modelId, Integer parkId
            , Double cordX, Double cordY, String spaceName) {
        orderService.insert(openId, carId, modelId, parkId, cordX, cordY, spaceName, new Date());
        return new CommonResponse<>(0, "新增订单成功", null);
    }

    //进入
    @RequestMapping("/getIn")
    public String getIn(Integer orderId) {
        orderService.getIn(orderId, new Date());
        return "进入成功";
    }

    //离开
    @RequestMapping("/getOut")
    public String getOut(Integer orderId) {
        Double price = orderService.getOut(orderId, new Date());
        //计算停车费用
        return "离开成功，本次停车费用为" + price + "元";
    }

    //将未使用的前一天的订单设为已取消状态 并将车位数量加回停车场
    @RequestMapping("/resetOrders")
    public CommonResponse<String> resetOrders() {
        orderService.resetOrders();
        return new CommonResponse<>(0, "订单重置成功", null);
    }

    //取消订单
    @RequestMapping("/cancelOrder")
    public CommonResponse<String> cancelOrder(Integer orderId) {
        orderService.cancelOrder(orderId);
        return new CommonResponse<>(0, "取消订单成功", null);
    }
}
