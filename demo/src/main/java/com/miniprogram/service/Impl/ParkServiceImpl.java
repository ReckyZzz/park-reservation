package com.miniprogram.service.Impl;

import com.miniprogram.mapper.ParkMapper;
import com.miniprogram.pojo.Park;
import com.miniprogram.service.ParkService;
import com.miniprogram.vo.ParkVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class ParkServiceImpl implements ParkService {
    @Resource
    ParkMapper parkMapper;

    public List<ParkVO> getList(){
        List<Park> parks = parkMapper.list();
        List<ParkVO> vos = new ArrayList<>();
        for(int i=0;i<parks.size();i++){
            ParkVO vo = getVoByPark(parks.get(i));
            vos.add(vo);
        }
        return vos;
    }

    public List<ParkVO> getAvailableList(){
        List<Park> parks = parkMapper.availableList();
        List<ParkVO> vos = new ArrayList<>();
        for(int i=0;i<parks.size();i++){
            ParkVO vo = getVoByPark(parks.get(i));
            vos.add(vo);
        }
        return vos;
    }

    public ParkVO getVoByPark(Park park){
        ParkVO vo = new ParkVO();
        vo.setParkId(park.getParkId());
        vo.setParkName(park.getParkName());
        vo.setLatitude(park.getLatitude());
        vo.setLongitude(park.getLongitude());
        vo.setAddress(park.getAddress());
        vo.setParkCapacity(park.getParkCapacity());
        vo.setMaxCapacity(park.getMaxCapacity());
        vo.setPrice(park.getPrice());
        vo.setMapId(park.getMapId());
        vo.setDistance(0);//由前端计算
        return vo;
    }

    public Park getParKById(Integer parkId){
        return parkMapper.getParkById(parkId);
    }

    public Integer updatePark(Integer parkId,String parkName,Double longitude,Double latitude,String address,
                       Integer maxCapacity,Integer parkCapacity, Double price,String mapId){
        return parkMapper.updatePark(parkId,parkName,longitude,latitude,address,maxCapacity,parkCapacity,price,mapId);
    }

    public Integer insertPark(String parkName,Double longitude,Double latitude,String address
            , Integer maxCapacity, Double price){
        return parkMapper.insert(parkName,longitude,latitude,address,maxCapacity,price);
    }
}
