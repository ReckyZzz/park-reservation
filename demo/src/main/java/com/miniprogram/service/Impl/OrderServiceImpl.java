package com.miniprogram.service.Impl;

import com.miniprogram.mapper.OrderMapper;
import com.miniprogram.mapper.ParkMapper;
import com.miniprogram.pojo.Order;
import com.miniprogram.pojo.Park;
import com.miniprogram.service.OrderService;
import com.miniprogram.vo.OrderVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    @Resource
    OrderMapper orderMapper;
    @Resource
    ParkMapper parkMapper;

    public List<OrderVO> getOrdersByUser(String openId){
        List<OrderVO> vos = new ArrayList<>();
        List<Order> orders = orderMapper.getOrdersByUser(openId);
        for(int i=0;i<orders.size();i++){
            OrderVO vo = getVoByOrder(orders.get(i));
            vos.add(vo);
        }
        return vos;
    }

    public List<Order> getOrdersToday(Integer parkId){
        return orderMapper.getOrdersToday(parkId,getToday());
    }

    public Order getOrderToday(String openId){
        return orderMapper.getOrderToday(openId,getToday());
    }

    public OrderVO getOrderVOById(Integer orderId){
        Order order = orderMapper.getOrderById(orderId);
        OrderVO vo = getVoByOrder(order);
        return vo;
    }

    public Integer insert(String openId, String carId, String modelId, Integer parkId, Double cordX, Double cordY,
                   String spaceName, Date reserveTime){
        //该停车场车位数量减一
        parkMapper.reserve(parkId);
        return orderMapper.insert(openId,carId,modelId,parkId,cordX,cordY,spaceName,reserveTime);
    }

    public Integer resetOrders(){
        int count = 0;
        List<Park> parks = parkMapper.list();
        for(Park p:parks){
            count = orderMapper.resetOrders(p.getParkId(),getToday());
            if(p.getParkCapacity() + count <= p.getMaxCapacity()){
                parkMapper.addCapacity(p.getParkId(),count);
            }
        }
        return count;
    }

    public Integer cancelOrder(Integer orderId){
        Order order = orderMapper.getOrderById(orderId);
        Park park = parkMapper.getParkById(order.getParkId());
        int count = 1;
        if(park.getParkCapacity() + count <= park.getMaxCapacity()){
            parkMapper.addCapacity(park.getParkId(),count);
        }
        return  orderMapper.cancelOrder(orderId);
    }

    public Integer getIn(Integer orderId,Date inTime){
        return orderMapper.setInTime(orderId,inTime);
    }

    public Double getOut(Integer orderId,Date outTime){
        Order order = orderMapper.getOrderById(orderId);
        orderMapper.setOutTime(orderId,outTime);
        Park park = parkMapper.getParkById(order.getParkId());
        //停车位数量加一
        if(park.getParkCapacity() + 1 <= park.getMaxCapacity()){
            parkMapper.addCapacity(park.getParkId(),1);
        }
        //计算费用
        Double price = 0.0;
        Calendar start = Calendar.getInstance();
        start.setTime(order.getInTime());
        Calendar end = Calendar.getInstance();
        end.setTime(new Date());
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
        orderMapper.setCost(orderId,price);
        return price;
    }

    public Order getOrderHereToday(String openId,Integer parkId){
        return orderMapper.hasOrderHereToday(openId,parkId,getToday());
    }

    public OrderVO getVoByOrder(Order order){
        OrderVO vo = new OrderVO();
        Park park = parkMapper.getParkById(order.getParkId());
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        vo.setOrderId(order.getOrderId());
        vo.setOpenId(order.getOpenId());
        vo.setCarId(order.getCarId());
        vo.setModelId(order.getModelId());
        vo.setParkId(order.getParkId());
        vo.setParkName(park.getParkName());
        vo.setCordX(order.getCordX());
        vo.setCordY(order.getCordY());
        vo.setSpaceName(order.getSpaceName());
        vo.setReserveTime(order.getReserveTime());
        vo.setReserveTimeString(format.format(order.getReserveTime()));
        if(order.getInTime() != null){
            vo.setInTime(order.getInTime());
            vo.setInTimeString(format.format(order.getInTime()));
        }
        if(order.getOutTime() != null){
            vo.setOutTime(order.getOutTime());
            vo.setOutTimeString(format.format(order.getOutTime()));
        }
        if(order.getCost() != null){
            vo.setCost(order.getCost());
        }
        vo.setStatus(order.getStatus());
        switch (order.getStatus()){
            case 0:
                vo.setStatusString("待使用");
                break;
            case 1:
                vo.setStatusString("使用中");
                break;
            case 2:
                vo.setStatusString("已完成");
                break;
            case 3:
                vo.setStatusString("已取消");
                break;
        }
        return vo;
    }

    //获取今日时间 格式为2021-xx-xx 00:00:00 目的是查询今日之后的订单
    Date getToday(){
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);//将Date设为20xx-xx-xx 00:00:00 以便查询今日之后的订单
        calendar.set(Calendar.HOUR,0);
        calendar.set(Calendar.MINUTE,0);
        calendar.set(Calendar.SECOND,0);
        today = calendar.getTime();
        return today;
    }
}
