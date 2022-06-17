# 🐳 Docker Compose prod
up_rmq: 
		@docker-compose -f ./rmq/docker-compose.yml up -d

down_rmq: 
		@docker-compose -f ./rmq/docker-compose.yml down