package model

import "time"

type Album struct {
	AlbumID   uint   `gorm:"primary_key"`
	ArtistID  uint   `gorm:"not null"`
	AlbumName string `gorm:"type:varchar(255);not null"`
	CreatedAt time.Time
	ImagePath string `gorm:"type:varchar(255);not null"`
	AlbumType string `gorm:"type:varchar(255);not null"`
}
