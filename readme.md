# Docker instructions

## Server
cd ./server
docker build nika/ttt-server .
docker run -p 3000:3000 --name ttt-server-container --rm -d nika/ttt-server

## Front
cd ./tic-tac-toe-front-end
docker build -t nika/ttt-front .
Run front: docker run --name ttt-front-container -p 4200:4200 --rm -d nika/ttt-front