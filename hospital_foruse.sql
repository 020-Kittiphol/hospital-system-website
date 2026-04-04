-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 05, 2026 at 12:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `app_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `app_date` datetime NOT NULL,
  `symptoms` text NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`app_id`, `user_id`, `doctor_id`, `app_date`, `symptoms`, `department_id`) VALUES
(1, 5, 1, '2026-04-05 20:30:00', 'ปวดอัณฑะ', 1),
(2, 6, 4, '2026-04-15 04:00:00', 'เสริมดั้ง', 4);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(64) NOT NULL,
  `department_date` datetime NOT NULL DEFAULT current_timestamp(),
  `department_id_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_id`, `department_name`, `department_date`, `department_id_code`) VALUES
(1, 'ทั่วไป', '2026-04-06 08:30:00', '1'),
(2, 'ทันตกรรม', '2026-04-08 10:00:00', '2'),
(3, 'อายุกรรม', '2026-04-07 07:20:00', '3'),
(4, 'ศัลยกรรม', '2026-04-15 11:00:00', '4');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `doctor_id` int(11) NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`doctor_id`, `first_name`, `last_name`, `department_id`) VALUES
(1, 'หมัด', 'เทพเจ้าดาวเหนือ', 1),
(2, 'แตงโม', 'ลูกใหญ่', 2),
(3, 'สสาร', 'อ่อนแรง', 3),
(4, 'ของเหลว', 'แข็งน้อย', 4);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Patients');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `age` int(100) NOT NULL,
  `nationality` varchar(64) NOT NULL,
  `citizen_id` varchar(64) NOT NULL,
  `gender` enum('ชาย','หญิง','','') NOT NULL,
  `weight` int(255) NOT NULL,
  `height` int(255) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_thai_520_w2;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `first_name`, `last_name`, `age`, `nationality`, `citizen_id`, `gender`, `weight`, `height`, `role_id`) VALUES
(1, 'wawa', '81dc9bdb52d04dc20036dbd8313ed055', 'วาวา', 'ไม่ยอมทำงาน', 0, '', '', 'ชาย', 0, 0, 1),
(2, 'film', '81dc9bdb52d04dc20036dbd8313ed055', 'ฟิม', 'อะไรก็ได้', 0, '', '', 'ชาย', 0, 0, 1),
(3, 'mad', '81dc9bdb52d04dc20036dbd8313ed055', 'หมัด', 'ตาวัน', 0, '', '', 'ชาย', 0, 0, 1),
(4, 'tangmo', '81dc9bdb52d04dc20036dbd8313ed055', 'แตงโม', 'ตะระริดติ๊ดตี๋', 0, '', '', 'ชาย', 0, 0, 1),
(5, 'kong', '8bf5dbb863676389afe173d2ee6dbf87', 'ก้อง', 'ก้อง', 39, '', '1234567898765', 'ชาย', 78, 197, 2),
(6, 'kewkew', '639b5213d4a9ceeb7dc8181041494076', 'กิ้ว', 'กิ้ว', 20, '', '9865432123456', 'หญิง', 65, 174, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`app_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`doctor_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `app_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
