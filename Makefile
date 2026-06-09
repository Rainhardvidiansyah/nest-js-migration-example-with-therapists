include .env

start-container-pg:
	docker run --name postgres-nest -e POSTGRES_USER=$(POSTGRES_USER) -e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) -e POSTGRES_DB=$(POSTGRES_DB) -p $(POSTGRES_PORT):5432 -d postgres:latest

db_run:
	docker container start postgres-nest

docker-compose-up:
	docker-compose up

db:
	docker exec -it postgres-nest psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

build-image: 
	docker build -t nest-oauth-app .

run-docker-compose:
	docker-compose up -d

stop-docker-compose:
	docker-compose down

rebuild:
	docker-compose down && docker-compose build --no-cache app && docker-compose up

build-app:
	docker-compose build --no-cache app


