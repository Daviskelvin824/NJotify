package model

import "time"

type PlaylistDetail struct {
	PlaylistID uint `gorm:"not null"`
	TrackID    uint `gorm:"not null"`
	DateAdded  time.Time
}