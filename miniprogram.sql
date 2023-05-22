/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : miniprogram

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 22/05/2023 12:39:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tb_order
-- ----------------------------
DROP TABLE IF EXISTS `tb_order`;
CREATE TABLE `tb_order`  (
  `order_id` int(0) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `car_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `model_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `park_id` int(0) NOT NULL,
  `cord_x` double NOT NULL,
  `cord_y` double NOT NULL,
  `space_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `reserve_time` datetime(6) NOT NULL,
  `in_time` datetime(6) NULL DEFAULT NULL,
  `out_time` datetime(0) NULL DEFAULT NULL,
  `cost` decimal(10, 2) NULL DEFAULT NULL,
  `status` int(0) NOT NULL DEFAULT 0 COMMENT '0--待使用 1--使用中 2--完成 3--已取消',
  PRIMARY KEY (`order_id`) USING BTREE,
  INDEX `key1`(`park_id`) USING BTREE,
  INDEX `key2`(`open_id`) USING BTREE,
  CONSTRAINT `key1` FOREIGN KEY (`park_id`) REFERENCES `tb_park` (`park_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `key2` FOREIGN KEY (`open_id`) REFERENCES `tb_user` (`open_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tb_order
-- ----------------------------
INSERT INTO `tb_order` VALUES (27, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793165473119866880', 2, 13268639.084860092, 3005614.586208406, '停车位03', '2021-05-11 14:07:54.647000', '2021-05-11 15:01:00.446000', '2021-05-11 15:35:19', 3.00, 2);
INSERT INTO `tb_order` VALUES (28, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793166111484547072', 2, 13268693.510516578, 3005613.5659922655, '停车位15', '2021-05-11 16:20:40.444000', '2021-05-11 16:21:37.574000', '2021-05-11 16:23:28', 0.00, 2);
INSERT INTO `tb_order` VALUES (29, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793165827672772608', 3, 13268639.075508397, 3005609.3610207895, '停车位04', '2021-05-15 16:16:44.673000', NULL, NULL, NULL, 3);
INSERT INTO `tb_order` VALUES (30, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793165827672772608', 3, 13268639.075508397, 3005609.3610207895, '停车位04', '2021-05-15 21:54:07.067000', NULL, NULL, NULL, 3);
INSERT INTO `tb_order` VALUES (31, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793165620721618944', 3, 13268653.829534382, 3005600.143912839, '停车位19', '2021-05-23 22:06:44.282000', '2021-05-23 22:08:09.902000', '2021-05-23 22:09:33', 0.00, 2);
INSERT INTO `tb_order` VALUES (32, 'oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', '6793166044346322944', 3, 13268676.040357789, 3005609.385667094, '停车位14', '2021-05-23 22:10:09.962000', '2021-05-23 22:11:09.269000', '2021-05-23 22:11:25', 0.00, 2);
INSERT INTO `tb_order` VALUES (33, 'oeB3N5bdRFYW1LO_a9ERumaaKboE', '闽A23456', '6793165853375467520', 3, 13268646.411758482, 3005614.568689581, '停车位05', '2021-05-23 22:38:15.863000', NULL, NULL, NULL, 0);

-- ----------------------------
-- Table structure for tb_park
-- ----------------------------
DROP TABLE IF EXISTS `tb_park`;
CREATE TABLE `tb_park`  (
  `park_id` int(0) NOT NULL AUTO_INCREMENT,
  `park_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `park_capacity` int(0) NOT NULL,
  `max_capacity` int(0) NOT NULL,
  `price` decimal(10, 2) NOT NULL,
  `map_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`park_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tb_park
-- ----------------------------
INSERT INTO `tb_park` VALUES (1, '三坊七巷景区停车场', 119.298352, 26.077422, '福建省福州市鼓楼区澳门路188号三坊七巷景区', 24, 24, 3.00, '1387381076270104577');
INSERT INTO `tb_park` VALUES (2, '协和医院停车场', 119.303993, 26.078505, '福建省福州市鼓楼区圣庙路与花园路交叉口福建医科大学附属协和医院外科楼B2-B3层', 24, 24, 3.00, '1387381076270104577');
INSERT INTO `tb_park` VALUES (3, '测试停车场', 119.288156, 26.073999, '福建省福州市鼓楼区柳兴路96号', 19, 20, 2.00, '1387381076270104577');
INSERT INTO `tb_park` VALUES (6, '123', 119.29647, 26.07421, '福建省福州市鼓楼区乌山路96号', 123, 123, 123.00, NULL);
INSERT INTO `tb_park` VALUES (7, '123', 119.29647, 26.07421, '福建省福州市鼓楼区乌山路96号', 123, 123, 213.00, NULL);
INSERT INTO `tb_park` VALUES (8, '123', 119.29647, 26.07421, '福建省福州市鼓楼区乌山路96号', 123, 123, 213.00, NULL);
INSERT INTO `tb_park` VALUES (9, '123', 123, 113, '123', 123, 123, 123.00, '123');

-- ----------------------------
-- Table structure for tb_user
-- ----------------------------
DROP TABLE IF EXISTS `tb_user`;
CREATE TABLE `tb_user`  (
  `open_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `car_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `longitude` double(255, 6) NULL DEFAULT NULL,
  `latitude` double(255, 6) NULL DEFAULT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`open_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tb_user
-- ----------------------------
INSERT INTO `tb_user` VALUES ('oeB3N5bdRFYW1LO_a9ERumaaKboE', '闽A23456', 119.296470, 26.074210, '测试号1', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJsAtB8P1DUMvrabzgkY0Df9aZiaxqTctjQiaqk9DbicdVtO3MSMFofKuibSwTnJ0rNmicCUf3j06Qb4PQ/132');
INSERT INTO `tb_user` VALUES ('oeB3N5bYM8kZbTKSJm4q02rktiVw', '闽A12345', 119.296470, 26.074210, 'Dante Mercer', 'https://thirdwx.qlogo.cn/mmopen/vi_32/Uiau1U5wqicztItuDB6ptlQEp4VTYCicQwLer8JHUfOosRITS5X2bPXr60wAuxv0IkJRE8qCbGhd9XTcZMKDhJypA/132');

SET FOREIGN_KEY_CHECKS = 1;
