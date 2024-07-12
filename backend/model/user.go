package model

import "time"

type User struct {
	UserId           uint `gorm:"primary_key"`
	Email            string
	Username         string `gorm:"type:varchar(255);not null"`
	Password         string `gorm:"type:varchar(255);not null"`
	Gender           string `gorm:"type:varchar(50);not null"`
	DOB              time.Time
	Country          string  `gorm:"type:varchar(255);not null"`
	ProfilePageImage *string `gorm:"type:varchar(255)"`
	IsVerified       bool    `gorm:"type:boolean;default:false"`
	IsArtist         bool    `gorm:"type:boolean;default:false"`
	BannerImage      *string `gorm:"type:varchar(255)"`
	AboutMe          *string `gorm:"type:text"`
}
