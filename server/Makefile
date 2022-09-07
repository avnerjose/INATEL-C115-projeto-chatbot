# Build the container
build:
	docker build -t chatbot .

# Run the container
run:
	docker run -i -t --rm -p=7999:7999 --name="chatbot" chatbot

# Build and run the container
up: build run

# Stop and remove a running container
stop:
	docker stop chatbot; docker rm chatbot