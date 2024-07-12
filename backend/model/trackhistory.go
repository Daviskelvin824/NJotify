package model

import "time"

type TrackHistory struct {
	TrackHistoryID uint `gorm:"primary_key"`
	TrackID        uint `gorm:"not null"`
	UserID         uint `gorm:"not null"`
	CreatedAt      time.Time
}
