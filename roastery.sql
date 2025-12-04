-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 04:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roastery`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `jumlah` int(11) NOT NULL,
  `total_harga` decimal(15,2) NOT NULL,
  `alamat_pengiriman` text NOT NULL,
  `bukti_bayar` varchar(255) DEFAULT NULL,
  `status` enum('pending','menunggu_verifikasi','lunas','dikirim','batal') DEFAULT 'pending',
  `tanggal_order` timestamp NOT NULL DEFAULT current_timestamp(),
  `estimasi_sampai` varchar(100) DEFAULT NULL,
  `bukti_diterima` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `jumlah`, `total_harga`, `alamat_pengiriman`, `bukti_bayar`, `status`, `tanggal_order`, `estimasi_sampai`, `bukti_diterima`) VALUES
(6, 3, 2, 4, 1000000.00, 'Jl Okesi No.3', 'bukti_order_6.jpg', '', '2025-11-23 15:17:09', '1 Hari', 'bukti_terima_6.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `nama_produk` varchar(100) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `roast_level` varchar(50) DEFAULT NULL,
  `proses` varchar(50) DEFAULT NULL,
  `acidity` varchar(50) DEFAULT NULL,
  `notes` varchar(100) DEFAULT NULL,
  `stok` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `nama_produk`, `harga`, `gambar`, `deskripsi`, `roast_level`, `proses`, `acidity`, `notes`, `stok`) VALUES
(1, 'Arabica Gayo', 150000.00, '/img/arabica-gayo.jpg', 'Body tebal, aroma rempah kuat.', 'Medium Dark', 'Giling Basah', 'Low', 'Spice, Dark Choco', 50),
(2, 'Sumatra Mandheling', 250000.00, '/img/sumatra-mandheling.jpg', 'Earthy dan intense, klasik Sumatra.', 'Medium Dark', 'Semi Washed', 'Low', 'Herbal, Cedar', 50),
(3, 'Arabica Kintamani', 120000.00, '/img/arabica-kintamani.jpg', 'Segar dengan aroma jeruk khas Bali.', 'Medium', 'Full Washed', 'High', 'Citrus, Brown Sugar', 50),
(4, 'Vietnam Robusta', 90000.00, '/img/vietnam-robusta.jpg', 'Bold, strong, cocok untuk kopi susu.', 'Dark', 'Natural', 'Low', 'Dark Cocoa, Nutty', 50),
(5, 'House Blend', 200000.00, '/img/house-blend.jpg', 'Racikan spesial Vinix Roastery.', 'Medium', 'Blend', 'Medium', 'Caramel, Nutty', 50),
(6, 'Toraja Sapan', 180000.00, '/img/toraja-sapan.jpg', 'Aroma herbal yang khas dengan rasa clean.', 'Medium', 'Fully Washed', 'Low', 'Herbal, Fruity', 50);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'Pembeli Santuy', 'user@gmail.com', 'user123', 'user', '2025-11-22 18:14:26'),
(3, 'dao', 'dao@gmail.com', 'dao', 'user', '2025-11-22 21:09:53'),
(6, 'Boss Vinix', 'admin@vinix.com', 'admin123', 'admin', '2025-11-22 21:38:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
