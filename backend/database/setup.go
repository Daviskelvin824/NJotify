package database

import (
	"fmt"

	"github.com/Daviskelvin824/TPA-Website/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "postgres"
	dbname   = "TPAwebsite"
)

var DB *gorm.DB

func migrate() {
	if DB != nil {
		DB.AutoMigrate(&model.User{})
		DB.AutoMigrate(&model.Album{})
		DB.AutoMigrate(&model.Track{})
		DB.AutoMigrate(&model.Follow{})
		DB.AutoMigrate(&model.TrackHistory{})
		DB.AutoMigrate(&model.Playlist{})
		DB.AutoMigrate(&model.PlaylistDetail{})
		DB.AutoMigrate(&model.AlbumHistory{})
		DB.AutoMigrate(&model.SearchHistory{})
	}
}

func ConnectDb() *gorm.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s TimeZone=Asia/Shanghai", host, port, user, password, dbname)
	db, err := gorm.Open(postgres.Open(psqlInfo), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB = db
	if err == nil {
		migrate()
	}

	return db
}
