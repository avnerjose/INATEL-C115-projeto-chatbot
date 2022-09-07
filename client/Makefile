build:
	docker build -t chatbot-front .

run:
	docker run -i -t --rm -p 3000:3000 --name="chatbot-front" chatbot-front

up: build run

stop:
	docker stop chatbot-front; docker rm chatbot-front