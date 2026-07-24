-- CreateTable
CREATE TABLE `access_rights` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(50) NOT NULL,
    `can_view_appointments` BOOLEAN NOT NULL DEFAULT false,
    `can_complete_appointment` BOOLEAN NOT NULL DEFAULT false,
    `can_forward_appointment` BOOLEAN NOT NULL DEFAULT false,
    `can_manage_department` BOOLEAN NOT NULL DEFAULT false,
    `can_manage_access` BOOLEAN NOT NULL DEFAULT false,
    `can_manage_holidays` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointment_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appointment_id` INTEGER NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `remarks` VARCHAR(500) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `patient_id` INTEGER NOT NULL,
    `department_id` INTEGER NOT NULL,
    `step` INTEGER NOT NULL DEFAULT 2,
    `schedule_date` DATE NOT NULL,
    `schedule_time` TIME(0) NOT NULL,
    `complaint` VARCHAR(500) NOT NULL,
    `type` CHAR(2) NOT NULL,
    `subjective` VARCHAR(500) NULL,
    `objective` VARCHAR(500) NULL,
    `assessment` VARCHAR(500) NULL,
    `plan` VARCHAR(500) NULL,
    `assessed_by` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_id` INTEGER NOT NULL,
    `day` VARCHAR(50) NOT NULL,
    `stime` TIME(0) NOT NULL,
    `etime` TIME(0) NOT NULL,
    `pax` INTEGER NOT NULL,
    `type` CHAR(1) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dept_name` VARCHAR(150) NULL,
    `dept_code` VARCHAR(50) NULL,
    `description` VARCHAR(500) NOT NULL,

    UNIQUE INDEX `dept_name_UNIQUE`(`dept_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holidays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `holiday` DATE NOT NULL,
    `target` INTEGER NULL,
    `description` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patient_dependents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `patient_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `patient_ukey` VARCHAR(255) NOT NULL,
    `fname` VARCHAR(50) NOT NULL,
    `mname` VARCHAR(50) NULL,
    `lname` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NULL,
    `ext_name` CHAR(5) NULL,
    `birth_date` DATE NULL,
    `civil_status` VARCHAR(20) NULL,
    `gender` CHAR(1) NULL,
    `religion` VARCHAR(50) NULL,
    `nationality` VARCHAR(50) NULL,
    `occupation` VARCHAR(150) NULL,
    `lot_no` VARCHAR(100) NULL,
    `street` VARCHAR(100) NULL,
    `barangay` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `province` VARCHAR(100) NULL,
    `mobile_no` VARCHAR(20) NULL,
    `spouse_name` VARCHAR(150) NULL,
    `spouse_address` VARCHAR(150) NULL,
    `father_name` VARCHAR(150) NULL,
    `mother_name` VARCHAR(150) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `patient_ukey`(`patient_ukey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_access` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `departments` JSON NULL,
    `access_right` INTEGER NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
