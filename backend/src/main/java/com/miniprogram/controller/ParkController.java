package com.miniprogram.controller;

import com.miniprogram.pojo.Park;
import com.miniprogram.response.CommonResponse;
import com.miniprogram.service.ParkService;
import com.miniprogram.vo.ParkVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class ParkController {
    @Resource
    ParkService parkService;

    //获取所有停车场列表
    @RequestMapping("/parkList")
    public CommonResponse<List<ParkVO>> parkList() {
        List<ParkVO> vos = parkService.getList();
        return new CommonResponse<>(0, "获取成功", vos);
    }

    //获取所有可用停车场 即地图画好的停车场
    @RequestMapping("/availableList")
    public CommonResponse<List<ParkVO>> availableList() {
        List<ParkVO> vos = parkService.getAvailableList();
        return new CommonResponse<>(0, "获取成功", vos);
    }

    @RequestMapping("/getParkById")
    public CommonResponse<Park> getParkById(Integer parkId) {
        Park park = parkService.getParKById(parkId);
        if (park != null) {
            return new CommonResponse<>(0, "获取成功", park);
        } else {
            return new CommonResponse<>(1, "该停车场不存在", null);
        }
    }

    @RequestMapping("/updatePark")
    public CommonResponse<String> updatePark(Integer parkId, String parkName, Double longitude, Double latitude
            , String address, Integer maxCapacity, Integer parkCapacity, Double price, String mapId) {
        parkService.updatePark(parkId, parkName, longitude, latitude, address, maxCapacity, parkCapacity, price, mapId);
        return new CommonResponse<>(0, "更新成功", null);
    }

    @RequestMapping("/newPark")
    public CommonResponse<String> newPark(String parkName, Double longitude, Double latitude, String address
            , Integer maxCapacity, Double price) {
        parkService.insertPark(parkName, longitude, latitude, address, maxCapacity, price);
        return new CommonResponse<>(0, "上传成功", null);
    }

    @RequestMapping("/upload")
    public String upload(HttpServletRequest request, MultipartFile file) throws IOException {
        System.out.println("执行upload");
        request.setCharacterEncoding("UTF-8");
        System.out.println("执行图片上传");
        String user = request.getParameter("user");
        System.out.println("user:" + user);
        if (!file.isEmpty()) {
            System.out.println("成功获取照片");
            String fileName = file.getOriginalFilename();
            String path = null;
            String type = null;
            type = fileName.indexOf(".") != -1 ? fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length()) : null;
            System.out.println("图片初始名称为：" + fileName + " 类型为：" + type);
            if (type != null) {
                if ("GIF".equals(type.toUpperCase()) || "PNG".equals(type.toUpperCase()) || "JPG".equals(type.toUpperCase())) {
                    // 项目在容器中实际发布运行的根路径
                    String realPath = request.getSession().getServletContext().getRealPath("/");
                    // 自定义的文件名称
                    String trueFileName = String.valueOf(System.currentTimeMillis()) + fileName;
                    // 设置存放图片文件的路径
                    path = realPath + "/uploads/" + trueFileName;
                    File directory = new File(realPath + "/uploads");
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    System.out.println("存放图片文件的路径:" + path);
                    file.transferTo(new File(path));
                    System.out.println("文件成功上传到指定目录下");
                } else {
                    System.out.println("不是我们想要的文件类型,请按要求重新上传");
                    return "error";
                }
            } else {
                System.out.println("文件类型为空");
                return "error";
            }
        } else {
            System.out.println("没有找到相对应的文件");
            return "error";
        }
        return "success";
    }
}
