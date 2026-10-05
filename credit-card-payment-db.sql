-- MySQL dump 10.13  Distrib 8.4.11, for Linux (aarch64)
--
-- Host: localhost    Database: credit_card_payment_db
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts_user`
--

DROP TABLE IF EXISTS `accounts_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `role` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_user`
--

LOCK TABLES `accounts_user` WRITE;
/*!40000 ALTER TABLE `accounts_user` DISABLE KEYS */;
INSERT INTO `accounts_user` VALUES (1,'pbkdf2_sha256$1500000$i1hJDevRDSNHN4dRJewDOM$FsEvCyrkLnF+AEuf8MMkSe0H3KtHMAhiWVhEtmK3H2I=',NULL,0,'testuser','','',0,1,'2026-10-03 11:16:42.225435','testuser@gmail.com','customer'),(2,'pbkdf2_sha256$1500000$umzm14npNPXX2WGWR6MPwo$UuzQDSTq47mq84aNA3Eo3OzKV7T1oQNBvKPxm3xFMG0=','2026-10-05 06:00:20.963923',1,'yusufadmin','','',1,1,'2026-10-03 11:40:53.381726','yusuf@gmail.com','customer'),(3,'pbkdf2_sha256$1500000$cg1RizlnrcbTjU95ww8jm7$5zKu8mEM5QaqvQDigIOpheaDzDFCTvHkMixo1CMayCg=',NULL,0,'testusername2','','',0,1,'2026-10-05 06:51:58.927324','testcustomer2@gmail.com','customer');
/*!40000 ALTER TABLE `accounts_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts_user_groups`
--

DROP TABLE IF EXISTS `accounts_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_user_groups_user_id_group_id_59c0b32f_uniq` (`user_id`,`group_id`),
  KEY `accounts_user_groups_group_id_bd11a704_fk_auth_group_id` (`group_id`),
  CONSTRAINT `accounts_user_groups_group_id_bd11a704_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `accounts_user_groups_user_id_52b62117_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_user_groups`
--

LOCK TABLES `accounts_user_groups` WRITE;
/*!40000 ALTER TABLE `accounts_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts_user_user_permissions`
--

DROP TABLE IF EXISTS `accounts_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq` (`user_id`,`permission_id`),
  KEY `accounts_user_user_p_permission_id_113bb443_fk_auth_perm` (`permission_id`),
  CONSTRAINT `accounts_user_user_p_permission_id_113bb443_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `accounts_user_user_p_user_id_e4f0a161_fk_accounts_` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_user_user_permissions`
--

LOCK TABLES `accounts_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `accounts_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add Blacklisted Token',6,'add_blacklistedtoken'),(22,'Can change Blacklisted Token',6,'change_blacklistedtoken'),(23,'Can delete Blacklisted Token',6,'delete_blacklistedtoken'),(24,'Can view Blacklisted Token',6,'view_blacklistedtoken'),(25,'Can add Outstanding Token',7,'add_outstandingtoken'),(26,'Can change Outstanding Token',7,'change_outstandingtoken'),(27,'Can delete Outstanding Token',7,'delete_outstandingtoken'),(28,'Can view Outstanding Token',7,'view_outstandingtoken'),(29,'Can add user',8,'add_user'),(30,'Can change user',8,'change_user'),(31,'Can delete user',8,'delete_user'),(32,'Can view user',8,'view_user'),(33,'Can add card',9,'add_card'),(34,'Can change card',9,'change_card'),(35,'Can delete card',9,'delete_card'),(36,'Can view card',9,'view_card'),(37,'Can add transaction',11,'add_transaction'),(38,'Can change transaction',11,'change_transaction'),(39,'Can delete transaction',11,'delete_transaction'),(40,'Can view transaction',11,'view_transaction'),(41,'Can add admin log',10,'add_adminlog'),(42,'Can change admin log',10,'change_adminlog'),(43,'Can delete admin log',10,'delete_adminlog'),(44,'Can view admin log',10,'view_adminlog');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards_card`
--

DROP TABLE IF EXISTS `cards_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards_card` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `card_type` varchar(10) NOT NULL,
  `masked_card` varchar(19) NOT NULL,
  `last_four` varchar(4) NOT NULL,
  `card_holder_name` varchar(100) NOT NULL,
  `expiry_month` smallint unsigned NOT NULL,
  `expiry_year` smallint unsigned NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cards_card_user_id_9c174339_fk_accounts_user_id` (`user_id`),
  CONSTRAINT `cards_card_user_id_9c174339_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`),
  CONSTRAINT `cards_card_chk_1` CHECK ((`expiry_month` >= 0)),
  CONSTRAINT `cards_card_chk_2` CHECK ((`expiry_year` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards_card`
--

LOCK TABLES `cards_card` WRITE;
/*!40000 ALTER TABLE `cards_card` DISABLE KEYS */;
INSERT INTO `cards_card` VALUES (1,'credit','**** **** **** 3456','3456','testuser',12,1234,'2026-10-03 11:18:12.612453',1),(2,'credit','**** **** **** 3456','3456','yusuf',12,3456,'2026-10-03 11:42:40.863551',2);
/*!40000 ALTER TABLE `cards_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_accounts_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (8,'accounts','user'),(1,'admin','logentry'),(2,'auth','group'),(3,'auth','permission'),(9,'cards','card'),(4,'contenttypes','contenttype'),(5,'sessions','session'),(6,'token_blacklist','blacklistedtoken'),(7,'token_blacklist','outstandingtoken'),(10,'transactions','adminlog'),(11,'transactions','transaction');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-10-03 11:01:45.725556'),(2,'contenttypes','0002_remove_content_type_name','2026-10-03 11:01:45.753435'),(3,'auth','0001_initial','2026-10-03 11:01:45.834443'),(4,'auth','0002_alter_permission_name_max_length','2026-10-03 11:01:45.854110'),(5,'auth','0003_alter_user_email_max_length','2026-10-03 11:01:45.857570'),(6,'auth','0004_alter_user_username_opts','2026-10-03 11:01:45.860956'),(7,'auth','0005_alter_user_last_login_null','2026-10-03 11:01:45.865165'),(8,'auth','0006_require_contenttypes_0002','2026-10-03 11:01:45.866253'),(9,'auth','0007_alter_validators_add_error_messages','2026-10-03 11:01:45.869130'),(10,'auth','0008_alter_user_username_max_length','2026-10-03 11:01:45.873899'),(11,'auth','0009_alter_user_last_name_max_length','2026-10-03 11:01:45.877553'),(12,'auth','0010_alter_group_name_max_length','2026-10-03 11:01:45.884465'),(13,'auth','0011_update_proxy_permissions','2026-10-03 11:01:45.889411'),(14,'auth','0012_alter_user_first_name_max_length','2026-10-03 11:01:45.892608'),(15,'accounts','0001_initial','2026-10-03 11:01:46.108204'),(16,'admin','0001_initial','2026-10-03 11:01:46.156595'),(17,'admin','0002_logentry_remove_auto_add','2026-10-03 11:01:46.160996'),(18,'admin','0003_logentry_add_action_flag_choices','2026-10-03 11:01:46.164954'),(19,'cards','0001_initial','2026-10-03 11:01:46.198652'),(20,'sessions','0001_initial','2026-10-03 11:01:46.211354'),(21,'token_blacklist','0001_initial','2026-10-03 11:01:46.270544'),(22,'token_blacklist','0002_outstandingtoken_jti_hex','2026-10-03 11:01:46.289129'),(23,'token_blacklist','0003_auto_20171017_2007','2026-10-03 11:01:46.296663'),(24,'token_blacklist','0004_auto_20171017_2013','2026-10-03 11:01:46.322102'),(25,'token_blacklist','0005_remove_outstandingtoken_jti','2026-10-03 11:01:46.340105'),(26,'token_blacklist','0006_auto_20171017_2113','2026-10-03 11:01:46.353977'),(27,'token_blacklist','0007_auto_20171017_2214','2026-10-03 11:01:46.417088'),(28,'token_blacklist','0008_migrate_to_bigautofield','2026-10-03 11:01:46.486043'),(29,'token_blacklist','0010_fix_migrate_to_bigautofield','2026-10-03 11:01:46.493732'),(30,'token_blacklist','0011_linearizes_history','2026-10-03 11:01:46.495108'),(31,'token_blacklist','0012_alter_outstandingtoken_user','2026-10-03 11:01:46.502473'),(32,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2026-10-03 11:01:46.508721'),(33,'transactions','0001_initial','2026-10-03 11:02:47.079765'),(34,'transactions','0002_adminlog','2026-10-03 11:02:54.479185');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('gf7f65j8qk04jmg1nwlrmk0qhz99oks5','.eJxVjMsOwiAQRf-FtSEw5enSvd9AGBikaiAp7cr479qkC93ec859sRC3tYZt0BLmzM4M2Ol3w5ge1HaQ77HdOk-9rcuMfFf4QQe_9kzPy-H-HdQ46reWugiXDIAxkyAj0ZIj9BhLEeiVJEu5eKFQg_NAoJUrxnqCZI2OE7H3B9v9N7w:1xDbkK:D-wP13eWiNyI09j3bWvfA9eyHPKYyRUjRVG1YNN8DMU','2026-10-19 06:00:20.966188'),('tqsoryzeasos5dvc6o34zmelvddei9dl','.eJxVjMsOwiAQRf-FtSEw5enSvd9AGBikaiAp7cr479qkC93ec859sRC3tYZt0BLmzM4M2Ol3w5ge1HaQ77HdOk-9rcuMfFf4QQe_9kzPy-H-HdQ46reWugiXDIAxkyAj0ZIj9BhLEeiVJEu5eKFQg_NAoJUrxnqCZI2OE7H3B9v9N7w:1xCy7F:-ujt0CAU5IWJemGXCPrkBwZJdop-d7aoktPb33KLB-8','2026-10-17 11:41:21.787005');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `card_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_payments_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2,1,100.00,'SUCCESS','2026-10-03 11:37:03'),(2,2,1,100.00,'SUCCESS','2026-10-03 11:48:33'),(3,2,2,100.00,'FAILED','2026-10-03 12:54:56'),(4,1,2,500.00,'PENDING','2026-10-05 08:44:24'),(5,1,2,250.00,'SUCCESS','2026-10-05 08:44:24'),(6,1,2,500.00,'PENDING','2026-10-05 10:56:54'),(7,1,2,250.00,'FAILED','2026-10-05 10:56:54');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_accounts_` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_accounts_` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExMjYxNiwiaWF0IjoxNzkxMDI2MjE2LCJqdGkiOiIzZjViN2NiMWNhMTQ0MTU2OGQxNWI0MmM0ODBmMmNjMyIsInVzZXJfaWQiOiIxIn0.L5b3hnmZ4lFKEviltNVbPWwFPm8z9CXOeqTRGxH657Y','2026-10-03 11:16:56.566371','2026-10-04 11:16:56.000000',1,'3f5b7cb1ca1441568d15b42c480f2cc3'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExNDExMywiaWF0IjoxNzkxMDI3NzEzLCJqdGkiOiJkZDUwNjk5YWQ2NzQ0YzAzYjQxZTdjZTEyMzIxMGNmNCIsInVzZXJfaWQiOiIyIn0.T8ei8aiFNqi_-xrqFtXPfzogXanxl5KY_NTUH-VhJmA','2026-10-03 11:41:53.018505','2026-10-04 11:41:53.000000',2,'dd50699ad6744c03b41e7ce123210cf4'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExNDIzMiwiaWF0IjoxNzkxMDI3ODMyLCJqdGkiOiIxYWI0MzM1ODE3Zjc0OGFkYmQzNTk1ZDE2MWNkNWMzZiIsInVzZXJfaWQiOiIyIn0.A5jN1Vskn0WdUuHp4i2TtuK66Nb0icWr-OV33VfdaWo','2026-10-03 11:43:52.736417','2026-10-04 11:43:52.000000',2,'1ab4335817f748adbd3595d161cd5c3f'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExNDM2MCwiaWF0IjoxNzkxMDI3OTYwLCJqdGkiOiI3MDVkZjg3YjQ4MTk0ZGFhOWY0N2VmNzRiNjJlYTg5YyIsInVzZXJfaWQiOiIyIn0.jgDu2gZVi2-tUiDTsVFubTnv-Aj8TT2R1IlVqk2Sb6M','2026-10-03 11:46:00.510128','2026-10-04 11:46:00.000000',2,'705df87b48194daa9f47ef74b62ea89c'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExNzAxNiwiaWF0IjoxNzkxMDMwNjE2LCJqdGkiOiJiZWFmYTAyYjYxMjk0OGRhOWMwZTI5ZjAwM2RlMWUwOSIsInVzZXJfaWQiOiIyIn0.5i3s5Hgm4ejyn7hpHD08u4tbaIsD9r_WSTWBXFxFnyw','2026-10-03 12:30:16.506616','2026-10-04 12:30:16.000000',2,'beafa02b612948da9c0e29f003de1e09'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTExNzMzOSwiaWF0IjoxNzkxMDMwOTM5LCJqdGkiOiI5OWIzY2E1MTk5OWM0M2ZmYmNhMWQ1MzJjM2RkY2VmYiIsInVzZXJfaWQiOiIyIn0.XwWcVS07dDEYRyMbNIyGnr_xo2qx7OJxMWE3oIdBfS4','2026-10-03 12:35:39.113742','2026-10-04 12:35:39.000000',2,'99b3ca51999c43ffbca1d532c3ddcefb'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI2NjQ5OCwiaWF0IjoxNzkxMTgwMDk4LCJqdGkiOiI2ZmM5NjZjMzFjN2M0OTU4OTMwYjdkNGEyM2I1NGMzMSIsInVzZXJfaWQiOiIyIn0.faxE7K7BIZcuPT2Iu_zJD3YThMAS-twXA0x9GQULUX8','2026-10-05 06:01:38.828631','2026-10-06 06:01:38.000000',2,'6fc966c31c7c4958930b7d4a23b54c31'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI2NjU4MywiaWF0IjoxNzkxMTgwMTgzLCJqdGkiOiIwY2U0ZjA0ZWYxMGI0YjczOTEwMjBiNzExZThjMTIwMyIsInVzZXJfaWQiOiIyIn0.Sq5sCWvWIBk4lITvTqbSzeQh95Rx4vcGtxwWXwyskfw','2026-10-05 06:03:03.208740','2026-10-06 06:03:03.000000',2,'0ce4f04ef10b4b7391020b711e8c1203'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI2NjYyOSwiaWF0IjoxNzkxMTgwMjI5LCJqdGkiOiIyMDIwNGZmYThkZjk0OTM5YmVkNTMzODY1Yzk1NzQ3ZCIsInVzZXJfaWQiOiIyIn0.U7Hl2DCe2nV0v5U9eSjfAjTkcthVJ-epmICSs5CxOPU','2026-10-05 06:03:49.506841','2026-10-06 06:03:49.000000',2,'20204ffa8df94939bed533865c95747d'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI2NjkyNSwiaWF0IjoxNzkxMTgwNTI1LCJqdGkiOiJkNDNlZDIwZDI1MDQ0OGFhYTBiYTNlOWQ1OTY3YjYzZiIsInVzZXJfaWQiOiIyIn0.R60DaUAwFPLKeLY2baPv4hMKVniKgCfTHR4gwH7JUO8','2026-10-05 06:08:45.686019','2026-10-06 06:08:45.000000',2,'d43ed20d250448aaa0ba3e9d5967b63f'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI2NzU1MiwiaWF0IjoxNzkxMTgxMTUyLCJqdGkiOiI4YWNhYTFlNDdiYmU0MTNhOWM2Y2NiNmRjZGE0MzY2MiIsInVzZXJfaWQiOiIyIn0.PGoKQPbZWYywBTEFHn_8Nvc4XrbAmm0c_tJh7sksLmw','2026-10-05 06:19:12.210142','2026-10-06 06:19:12.000000',2,'8acaa1e47bbe413a9c6ccb6dcda43662'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc5MTI3NTA0OCwiaWF0IjoxNzkxMTg4NjQ4LCJqdGkiOiIwOTIxN2U5NDg1NjU0ZGU4OTI0MjIzZDliZjZkZGE2ZSIsInVzZXJfaWQiOiIzIn0.aUi7Lnu_rLCkoXHrfWxEjek1EembWhmZ3NG7_qn9O50','2026-10-05 08:24:08.184036','2026-10-06 08:24:08.000000',3,'09217e9485654de8924223d9bf6dda6e');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions_adminlog`
--

DROP TABLE IF EXISTS `transactions_adminlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions_adminlog` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `admin_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_adminlog_admin_id_f5b0e17e_fk_accounts_user_id` (`admin_id`),
  CONSTRAINT `transactions_adminlog_admin_id_f5b0e17e_fk_accounts_user_id` FOREIGN KEY (`admin_id`) REFERENCES `accounts_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions_adminlog`
--

LOCK TABLES `transactions_adminlog` WRITE;
/*!40000 ALTER TABLE `transactions_adminlog` DISABLE KEYS */;
INSERT INTO `transactions_adminlog` VALUES (1,'Viewed Admin Dashboard','2026-10-05 06:22:00.529349',2),(2,'Viewed Admin Dashboard','2026-10-05 06:22:00.584993',2);
/*!40000 ALTER TABLE `transactions_adminlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions_transaction`
--

DROP TABLE IF EXISTS `transactions_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `payment_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_transactions_transaction_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions_transaction`
--

LOCK TABLES `transactions_transaction` WRITE;
/*!40000 ALTER TABLE `transactions_transaction` DISABLE KEYS */;
INSERT INTO `transactions_transaction` VALUES (1,2,1,100.00,'SUCCESS','2026-10-03 11:37:51'),(2,2,2,100.00,'SUCCESS','2026-10-03 11:48:34'),(3,2,3,100.00,'FAILED','2026-10-03 12:54:56'),(4,1,5,250.00,'SUCCESS','2026-10-05 08:44:24'),(5,1,7,250.00,'FAILED','2026-10-05 10:56:54');
/*!40000 ALTER TABLE `transactions_transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 12:13:22
