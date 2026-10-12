USE visual_novel;

-- TiDB / MySQL 8 compatible. Run in an EMPTY database.
-- Create database separately in TiDB Cloud, then select it before running this script.
-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    project_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (project_id),
    KEY idx_projects_user (user_id),

    CONSTRAINT fk_projects_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 3. CHARACTERS
CREATE TABLE IF NOT EXISTS characters (
    char_id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(2048) NULL,

    PRIMARY KEY (char_id),
    KEY idx_characters_project (project_id),

    CONSTRAINT fk_characters_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 4. SCENES
CREATE TABLE IF NOT EXISTS scenes (
    scene_id BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    scene_name VARCHAR(255) NOT NULL,
    background_url VARCHAR(2048) NULL,
    text TEXT NULL,
    scene_order INT NOT NULL DEFAULT 1,

    PRIMARY KEY (scene_id),
    KEY idx_scenes_project (project_id),
    KEY idx_scenes_project_order (project_id, scene_order),

    CONSTRAINT fk_scenes_project
        FOREIGN KEY (project_id)
        REFERENCES projects (project_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 5. CHOICES
CREATE TABLE IF NOT EXISTS choices (
    choice_id BIGINT NOT NULL AUTO_INCREMENT,
    scene_id BIGINT NOT NULL,
    next_scene_id BIGINT NULL,
    label VARCHAR(255) NOT NULL,
    choice_order INT NOT NULL DEFAULT 1,

    PRIMARY KEY (choice_id),
    KEY idx_choices_scene_order (scene_id, choice_order),
    KEY idx_choices_next_scene (next_scene_id),

    CONSTRAINT fk_choices_scene
        FOREIGN KEY (scene_id)
        REFERENCES scenes (scene_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_choices_next
        FOREIGN KEY (next_scene_id)
        REFERENCES scenes (scene_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;