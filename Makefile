# 🐳 Docker DEV

# RMQ
up_rmq: 
		@docker-compose -f ./rmq/docker-compose.yml up -d
down_rmq: 
		@docker-compose -f ./rmq/docker-compose.yml down

# MONGO
up_mongo: 
		@docker-compose -f ./mongo/docker-compose.yml up -d
down_mongo: 
		@docker-compose -f ./mongo/docker-compose.yml down

# REDIS
up_redis: 
		@docker-compose -f ./redis/docker-compose.yml up -d
down_redis: 
		@docker-compose -f ./redis/docker-compose.yml down


up_i:
	make up_rmq
	make up_mongo
	make up_redis

down_i:
	make down_rmq
	make down_mongo
	make down_redis
