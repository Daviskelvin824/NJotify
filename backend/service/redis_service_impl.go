package service

import (
	"context"
	"encoding/json"
	"time"

	"github.com/Daviskelvin824/TPA-Website/helper"
	"github.com/redis/go-redis/v9"
)

type RedisService struct{
	client *redis.Client
	context context.Context
}

func NewRedisServiceImpl() RedisService{
	return RedisService{
		client: redis.NewClient(&redis.Options{
			Addr: "localhost:6379",
			Password: "",
			DB: 0,
		}),
		context: context.Background(),
	}
}

func(s *RedisService) SetData(key string,data interface{}, expiration time.Duration)error{
	//SERIALIZE
	jsonString,err := json.Marshal(data)
	helper.CheckPanic(err)

	//save to redis
	result := s.client.Set(s.context,key,jsonString,expiration)
	return result.Err()
}

func (s *RedisService) GetData(key string, out interface{}) (error){
	result := s.client.Get(s.context,key)

	if result.Err() != nil{
		return result.Err()
	}
	jsonString, err := result.Result()
	helper.CheckPanic(err)
	return json.Unmarshal([]byte(jsonString),out)
}

func (s *RedisService) ClearKeyFromRedis(key string) error{
	result := s.client.Del(s.context,key)
	return result.Err()
}

func (r *RedisService) FlushDB() error {
	return r.client.FlushDB(context.Background()).Err()
}