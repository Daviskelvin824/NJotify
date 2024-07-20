package model

import "time"

type AlbumHistory struct {
	AlbumHistoryID uint `gorm:"primary_key"`
	AlbumID        uint `gorm:"not null"`
	UserID         uint `gorm:"not null"`
	CreatedAt      time.Time
}