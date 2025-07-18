-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-07-2025 a las 15:25:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_elizabeth`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_ventas`
--

CREATE TABLE `detalle_ventas` (
  `id_detalle` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_ventas`
--

INSERT INTO `detalle_ventas` (`id_detalle`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(1, 6, 9, 1, 28.00, 28.00),
(2, 6, 6, 1, 25.00, 25.00),
(3, 6, 8, 1, 35.00, 35.00),
(4, 6, 10, 1, 22.00, 22.00),
(5, 6, 4, 1, 22.00, 22.00),
(6, 6, 2, 1, 18.50, 18.50),
(7, 6, 1, 1, 12.00, 12.00),
(8, 6, 3, 1, 15.00, 15.00),
(9, 6, 7, 1, 18.00, 18.00),
(10, 6, 5, 1, 45.00, 45.00),
(11, 7, 10, 1, 22.00, 22.00),
(12, 8, 9, 1, 28.00, 28.00),
(13, 9, 2, 23, 18.50, 425.50),
(14, 9, 10, 2, 22.00, 44.00),
(15, 10, 9, 10, 28.00, 280.00),
(16, 11, 17, 5, 5.00, 25.00),
(17, 12, 12, 4, 15.50, 62.00),
(18, 12, 6, 2, 25.00, 50.00),
(19, 13, 9, 4, 28.00, 112.00),
(20, 14, 12, 1, 15.50, 15.50),
(21, 15, 6, 1, 25.00, 25.00);

--
-- Disparadores `detalle_ventas`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_venta` AFTER INSERT ON `detalle_ventas` FOR EACH ROW BEGIN
    UPDATE productos 
    SET stock_actual = stock_actual - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
    
    INSERT INTO movimientos_inventario (id_producto, id_empleado, tipo_movimiento, cantidad, motivo)
    SELECT NEW.id_producto, v.id_empleado, 'Salida', NEW.cantidad, 'Venta'
    FROM ventas v WHERE v.id_venta = NEW.id_venta;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id_empleado` varchar(10) NOT NULL,
  `nombre_completo` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `cargo` enum('Cajero','Auxiliar','Almacenista','Administrador') NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id_empleado`, `nombre_completo`, `usuario`, `contrasena`, `telefono`, `cargo`, `fecha_creacion`, `activo`) VALUES
('EMP002', 'María López Hernández', 'mlopez', '123456', '5551234568', 'Auxiliar', '2025-07-10 20:42:31', 0),
('EMP003', 'Carlos Ruiz Martínez', 'cruiz', '123456', '5551234569', 'Almacenista', '2025-07-10 20:42:31', 0),
('EMP004', 'Ana García Rodríguez', 'agarcia', '123456', '5551234570', 'Administrador', '2025-07-10 20:42:31', 0),
('EMP005', 'Jesus David Cuapio LimI', 'Cuapio', '$2a$10$RZQE6IiJFyI3xl5Tb4xfFeAvnzjmb73Gg/5gMj728lGxwUa1rMM7a', '2461063539', 'Administrador', '2025-07-11 01:00:43', 1),
('EMP006', 'Lady gaga', 'LG', '$2a$10$KmxO/9z7xOwruo6ogHZ.V.1MCet171igcmPULdbrfWd9v95FigCNK', '2461213355', 'Auxiliar', '2025-07-11 02:04:04', 1),
('EMP007', 'Jungkook', 'JK', '$2a$10$onF2e1acNVFdY.TCdMmZc.jMrO3liBaVIe9puCcz//qcCzoO9KTgG', '7761292552', 'Almacenista', '2025-07-11 02:14:16', 1),
('EMP008', 'Michael Jackson', 'MJ', '$2a$10$knSUEmp5v3OP40yZZBdOrOUdAqB.GopomwOXPgEKG/GUqwxIDbPdK', '7761292557', 'Cajero', '2025-07-11 02:26:57', 1),
('EMP022', 'Daniel Perez', 'Daniel', '$2a$10$kQCXfSgdNmBWxJpctTCeJuUd6z8SRKdWJ7Pv1.GtVtFPVL0l6vP6K', '246106108', 'Administrador', '2025-07-16 05:47:52', 1),
('EMP100', '12345', '123', '$2a$10$PvHCxsX3bGIv.H7DyhMjiOF/tw7kGwN9HwRqg.E.vTuo.LIDwX9ja', 'JKL', 'Cajero', '2025-07-14 14:26:26', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id_movimiento` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_empleado` varchar(10) NOT NULL,
  `tipo_movimiento` enum('Entrada','Salida','Ajuste') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id_movimiento`, `id_producto`, `id_empleado`, `tipo_movimiento`, `cantidad`, `motivo`, `fecha_movimiento`) VALUES
(1, 9, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:13'),
(2, 6, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:13'),
(3, 8, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:13'),
(4, 10, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(5, 4, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(6, 2, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(7, 1, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(8, 3, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(9, 7, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(10, 5, 'EMP005', 'Salida', 1, 'Venta', '2025-07-12 22:49:14'),
(11, 6, 'EMP006', 'Entrada', 150, 'Recepción de productos', '2025-07-13 03:01:28'),
(12, 11, 'EMP006', 'Entrada', 100, 'Recepción de productos', '2025-07-13 03:33:16'),
(13, 1, 'EMP005', 'Entrada', 25, 'Corrección de error - Ajuste por conteo fisico', '2025-07-13 04:02:12'),
(14, 1, 'EMP005', 'Salida', 10, 'Corrección de error', '2025-07-13 04:05:51'),
(15, 1, 'EMP005', 'Entrada', 86, 'Producto dañado', '2025-07-13 04:08:07'),
(16, 10, 'EMP008', 'Salida', 1, 'Venta', '2025-07-14 02:50:28'),
(17, 9, 'EMP008', 'Salida', 1, 'Venta', '2025-07-14 03:47:39'),
(18, 2, 'EMP005', 'Entrada', 4, 'Devolución proveedor - hola', '2025-07-14 04:59:51'),
(19, 2, 'EMP100', 'Salida', 23, 'Venta', '2025-07-14 14:32:10'),
(20, 10, 'EMP100', 'Salida', 2, 'Venta', '2025-07-14 14:32:10'),
(21, 9, 'EMP100', 'Salida', 10, 'Venta', '2025-07-14 14:34:51'),
(22, 2, 'EMP007', 'Entrada', 5, 'Otro - SOLO E MINIMO', '2025-07-14 14:38:53'),
(23, 6, 'EMP005', 'Entrada', 6, 'Recepción de productos', '2025-07-16 07:20:20'),
(24, 12, 'EMP005', 'Entrada', 123, 'Recepción de productos', '2025-07-17 00:31:33'),
(25, 13, 'EMP005', 'Entrada', 50, 'Recepción de productos', '2025-07-17 03:04:41'),
(26, 14, 'EMP005', 'Entrada', 5, 'Recepción de productos', '2025-07-17 03:17:54'),
(27, 15, 'EMP005', 'Entrada', 15, 'Recepción de productos', '2025-07-17 03:33:28'),
(28, 16, 'EMP005', 'Entrada', 115, 'Recepción de productos', '2025-07-17 03:42:19'),
(29, 16, 'EMP005', 'Entrada', 2020, 'Recepción de productos', '2025-07-17 03:49:04'),
(30, 16, 'EMP005', 'Entrada', 50, 'Recepción de productos', '2025-07-17 03:49:39'),
(31, 17, 'EMP005', 'Entrada', 150, 'Recepción de productos', '2025-07-18 07:19:41'),
(32, 17, 'EMP005', 'Entrada', 20, 'Recepción de productos', '2025-07-18 07:20:26'),
(33, 12, 'EMP005', 'Entrada', 244, 'Corrección de error - jasjsajsa', '2025-07-18 08:50:44'),
(34, 12, 'EMP005', 'Entrada', 121, 'motivos personales - asasa', '2025-07-18 09:00:37'),
(35, 17, 'EMP008', 'Salida', 5, 'Venta', '2025-07-18 09:51:47'),
(36, 12, 'EMP008', 'Salida', 4, 'Venta', '2025-07-18 10:13:59'),
(37, 6, 'EMP008', 'Salida', 2, 'Venta', '2025-07-18 10:13:59'),
(38, 9, 'EMP008', 'Salida', 4, 'Venta', '2025-07-18 10:33:10'),
(39, 12, 'EMP008', 'Salida', 1, 'Venta', '2025-07-18 13:02:06'),
(40, 6, 'EMP008', 'Salida', 1, 'Venta', '2025-07-18 13:04:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo_producto` varchar(50) DEFAULT 'General',
  `precio` decimal(10,2) NOT NULL,
  `stock_actual` int(11) DEFAULT 0,
  `stock_minimo` int(11) DEFAULT 5,
  `unidad_medida` varchar(20) DEFAULT 'unidades',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo`, `nombre`, `tipo_producto`, `precio`, `stock_actual`, `stock_minimo`, `unidad_medida`, `fecha_creacion`, `activo`) VALUES
(1, 'PRD001', 'Manzana Roja', 'General', 12.00, 150, 10, 'unidades', '2025-07-10 20:42:42', 1),
(2, 'PRD002', 'Leche Entera', 'General', 18.50, 5, 5, 'unidades', '2025-07-10 20:42:42', 1),
(3, 'PRD003', 'Pan Blanco', 'General', 15.00, 99, 15, 'unidades', '2025-07-10 20:42:42', 1),
(4, 'PRD004', 'Jugo de Naranja', 'General', 22.00, 34, 8, 'unidades', '2025-07-10 20:42:42', 1),
(5, 'PRD005', 'Queso Amarillo', 'General', 45.00, 39, 5, 'unidades', '2025-07-10 20:42:42', 1),
(6, 'PRD006', 'Coca Cola', 'General', 25.00, 212, 12, 'unidades', '2025-07-10 20:42:42', 1),
(7, 'PRD007', 'Papel Higiénico', 'General', 18.00, 29, 6, 'unidades', '2025-07-10 20:42:42', 1),
(8, 'PRD008', 'Detergente', 'General', 35.00, 24, 4, 'unidades', '2025-07-10 20:42:42', 1),
(9, 'PRD009', 'Arroz', 'General', 28.00, 64, 10, 'unidades', '2025-07-10 20:42:42', 1),
(10, 'PRD010', 'Frijoles', 'General', 22.00, 41, 8, 'unidades', '2025-07-10 20:42:42', 1),
(11, 'PRD011', 'Electrolit', 'General', 20.50, 200, 10, 'unidades', '2025-07-13 03:33:15', 1),
(12, 'PRD012', 'Cafe', 'General', 15.50, 606, 15, 'unidades', '2025-07-17 00:31:33', 1),
(13, 'PRD013', 'cocoa', 'General', 15.00, 100, 20, 'unidades', '2025-07-17 03:04:41', 1),
(14, 'PRD014', 'Kinder', 'General', 25.00, 10, 25, 'unidades', '2025-07-17 03:17:54', 1),
(15, 'PRD015', 'LELE', 'General', 25.50, 30, 23, 'unidades', '2025-07-17 03:33:28', 1),
(16, 'PRD016', 'Crueee', 'Huevos', 25.00, 2300, 16, 'pieza', '2025-07-17 03:42:19', 1),
(17, 'PRD017', 'Mazapan', 'Dulces', 5.00, 335, 25, 'Piezas', '2025-07-18 07:19:41', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recepcion_productos`
--

CREATE TABLE `recepcion_productos` (
  `id_recepcion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_empleado` varchar(10) NOT NULL,
  `cantidad_recibida` int(11) NOT NULL,
  `fecha_recepcion` date NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recepcion_productos`
--

INSERT INTO `recepcion_productos` (`id_recepcion`, `id_producto`, `id_empleado`, `cantidad_recibida`, `fecha_recepcion`, `observaciones`, `fecha_registro`) VALUES
(1, 6, 'EMP006', 150, '2025-07-13', 'oa', '2025-07-13 03:01:28'),
(2, 11, 'EMP006', 100, '2025-07-13', 'Producto nuevo - Stock inicial', '2025-07-13 03:33:16'),
(3, 6, 'EMP005', 6, '2025-07-16', NULL, '2025-07-16 07:20:20'),
(4, 12, 'EMP005', 123, '2025-07-16', 'hola hola ', '2025-07-17 00:31:33'),
(5, 13, 'EMP005', 50, '2025-07-16', 'cocoa', '2025-07-17 03:04:41'),
(6, 14, 'EMP005', 5, '2025-07-16', 'huevo kinder delice', '2025-07-17 03:17:54'),
(7, 15, 'EMP005', 15, '2025-07-16', 'oxoxox', '2025-07-17 03:33:28'),
(8, 16, 'EMP005', 115, '2025-07-16', 'hola', '2025-07-17 03:42:19'),
(9, 16, 'EMP005', 2020, '2025-07-16', 'cocoa', '2025-07-17 03:49:04'),
(10, 16, 'EMP005', 50, '2025-07-16', 'cococ', '2025-07-17 03:49:39'),
(11, 17, 'EMP005', 150, '2025-07-18', 'hola', '2025-07-18 07:19:41'),
(12, 17, 'EMP005', 20, '2025-07-18', 'hola', '2025-07-18 07:20:26');

--
-- Disparadores `recepcion_productos`
--
DELIMITER $$
CREATE TRIGGER `actualizar_stock_recepcion` AFTER INSERT ON `recepcion_productos` FOR EACH ROW BEGIN
    UPDATE productos 
    SET stock_actual = stock_actual + NEW.cantidad_recibida
    WHERE id_producto = NEW.id_producto;
    
    INSERT INTO movimientos_inventario (id_producto, id_empleado, tipo_movimiento, cantidad, motivo)
    VALUES (NEW.id_producto, NEW.id_empleado, 'Entrada', NEW.cantidad_recibida, 'Recepción de productos');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_productos`
--

CREATE TABLE `reportes_productos` (
  `id_reporte` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_empleado` varchar(10) NOT NULL,
  `tipo_reporte` enum('Producto dañado','Producto faltante') NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_reporte` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('Pendiente','En proceso','Resuelto') DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reportes_productos`
--

INSERT INTO `reportes_productos` (`id_reporte`, `id_producto`, `id_empleado`, `tipo_reporte`, `descripcion`, `fecha_reporte`, `estado`) VALUES
(1, 1, 'EMP002', 'Producto dañado', 'El envase llegó roto y se derramó el contenido.', '2025-07-10 20:43:00', 'Pendiente'),
(2, 2, 'EMP003', 'Producto faltante', 'No se recibió la cantidad completa solicitada.', '2025-07-10 20:43:00', 'Pendiente'),
(3, 3, 'EMP002', 'Producto dañado', 'Pan con moho detectado durante inspección.', '2025-07-10 20:43:00', 'Pendiente'),
(4, 4, 'EMP003', 'Producto faltante', 'Faltaron 5 unidades en la entrega del proveedor.', '2025-07-10 20:43:00', 'Pendiente'),
(5, 8, 'EMP005', 'Producto dañado', 'hola coca', '2025-07-14 07:32:26', 'Pendiente'),
(6, 4, 'EMP005', 'Producto faltante', 'asa', '2025-07-14 07:57:16', 'Pendiente'),
(7, 10, 'EMP005', 'Producto dañado', 'caducado', '2025-07-14 14:48:36', 'Pendiente'),
(8, 6, 'EMP005', 'Producto dañado', 'cacaooo', '2025-07-18 05:02:58', 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_empleado` varchar(10) NOT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `pago_cliente` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cambio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` enum('Completada','Cancelada') DEFAULT 'Completada'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_empleado`, `fecha_venta`, `total`, `pago_cliente`, `cambio`, `estado`) VALUES
(6, 'EMP005', '2025-07-12 22:49:13', 240.50, 0.00, 0.00, 'Completada'),
(7, 'EMP008', '2025-07-14 02:50:28', 22.00, 0.00, 0.00, 'Completada'),
(8, 'EMP008', '2025-07-14 03:47:39', 28.00, 0.00, 0.00, 'Completada'),
(9, 'EMP100', '2025-07-14 14:32:10', 469.50, 0.00, 0.00, 'Completada'),
(10, 'EMP100', '2025-07-14 14:34:51', 280.00, 0.00, 0.00, 'Completada'),
(11, 'EMP008', '2025-07-18 09:51:47', 25.00, 1200.00, 1175.00, 'Completada'),
(12, 'EMP008', '2025-07-18 10:13:59', 112.00, 1200.50, 1088.50, 'Completada'),
(13, 'EMP008', '2025-07-18 10:33:10', 112.00, 1200.00, 1088.00, 'Completada'),
(14, 'EMP008', '2025-07-18 13:02:06', 15.50, 150.00, 134.50, 'Completada'),
(15, 'EMP008', '2025-07-18 13:04:05', 25.00, 500.00, 475.00, 'Completada');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_inventario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_inventario` (
`codigo` varchar(20)
,`nombre` varchar(100)
,`tipo_producto` varchar(50)
,`precio` decimal(10,2)
,`stock_actual` int(11)
,`stock_minimo` int(11)
,`unidad_medida` varchar(20)
,`fecha_creacion` timestamp
,`estado_stock` varchar(12)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_reportes_productos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_reportes_productos` (
`id_reporte` int(11)
,`codigo` varchar(20)
,`nombre_producto` varchar(100)
,`tipo_reporte` enum('Producto dañado','Producto faltante')
,`descripcion` text
,`empleado_reporta` varchar(100)
,`fecha_reporte` varchar(10)
,`estado` enum('Pendiente','En proceso','Resuelto')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_ventas_detalle`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_ventas_detalle` (
`id_venta` int(11)
,`fecha_venta` varchar(24)
,`empleado` varchar(100)
,`producto` varchar(100)
,`cantidad` int(11)
,`precio_unitario` decimal(10,2)
,`subtotal` decimal(10,2)
,`total` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_inventario`
--
DROP TABLE IF EXISTS `vista_inventario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_inventario`  AS SELECT `p`.`codigo` AS `codigo`, `p`.`nombre` AS `nombre`, `p`.`tipo_producto` AS `tipo_producto`, `p`.`precio` AS `precio`, `p`.`stock_actual` AS `stock_actual`, `p`.`stock_minimo` AS `stock_minimo`, `p`.`unidad_medida` AS `unidad_medida`, `p`.`fecha_creacion` AS `fecha_creacion`, CASE WHEN `p`.`stock_actual` <= `p`.`stock_minimo` THEN 'Bajo stock' ELSE 'Stock normal' END AS `estado_stock` FROM `productos` AS `p` WHERE `p`.`activo` = 1 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_reportes_productos`
--
DROP TABLE IF EXISTS `vista_reportes_productos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_reportes_productos`  AS SELECT `r`.`id_reporte` AS `id_reporte`, `p`.`codigo` AS `codigo`, `p`.`nombre` AS `nombre_producto`, `r`.`tipo_reporte` AS `tipo_reporte`, `r`.`descripcion` AS `descripcion`, `e`.`nombre_completo` AS `empleado_reporta`, date_format(`r`.`fecha_reporte`,'%Y-%m-%d') AS `fecha_reporte`, `r`.`estado` AS `estado` FROM ((`reportes_productos` `r` join `productos` `p` on(`r`.`id_producto` = `p`.`id_producto`)) join `empleados` `e` on(`r`.`id_empleado` = `e`.`id_empleado`)) ORDER BY `r`.`fecha_reporte` DESC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_ventas_detalle`
--
DROP TABLE IF EXISTS `vista_ventas_detalle`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_ventas_detalle`  AS SELECT `v`.`id_venta` AS `id_venta`, date_format(`v`.`fecha_venta`,'%Y-%m-%d %H:%i:%s') AS `fecha_venta`, `e`.`nombre_completo` AS `empleado`, `p`.`nombre` AS `producto`, `dv`.`cantidad` AS `cantidad`, `dv`.`precio_unitario` AS `precio_unitario`, `dv`.`subtotal` AS `subtotal`, `v`.`total` AS `total` FROM (((`ventas` `v` join `empleados` `e` on(`v`.`id_empleado` = `e`.`id_empleado`)) join `detalle_ventas` `dv` on(`v`.`id_venta` = `dv`.`id_venta`)) join `productos` `p` on(`dv`.`id_producto` = `p`.`id_producto`)) ORDER BY `v`.`fecha_venta` DESC ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id_empleado`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `recepcion_productos`
--
ALTER TABLE `recepcion_productos`
  ADD PRIMARY KEY (`id_recepcion`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `reportes_productos`
--
ALTER TABLE `reportes_productos`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_empleado` (`id_empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `recepcion_productos`
--
ALTER TABLE `recepcion_productos`
  MODIFY `id_recepcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `reportes_productos`
--
ALTER TABLE `reportes_productos`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalle_ventas`
--
ALTER TABLE `detalle_ventas`
  ADD CONSTRAINT `detalle_ventas_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id_venta`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalle_ventas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `movimientos_inventario_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);

--
-- Filtros para la tabla `recepcion_productos`
--
ALTER TABLE `recepcion_productos`
  ADD CONSTRAINT `recepcion_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `recepcion_productos_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);

--
-- Filtros para la tabla `reportes_productos`
--
ALTER TABLE `reportes_productos`
  ADD CONSTRAINT `reportes_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `reportes_productos_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
