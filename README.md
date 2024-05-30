# PomoTick
PomoTick is a time management application based on the Pomodoro technique, designed to help you increase your productivity and focus. With an intuitive and easy-to-use interface, PomoTick allows you to divide your work into time intervals, called "Pomodoros", interspersed with short breaks to maximize efficiency.

## Build and Run container
### Build Image:
```bash
docker build -t pomotrick:unstable . --no-cache
```
### Run Container:
```bash
docker run -d -p 3000:3000 -v $(pwd):/app --name pomotrick-app pomotrick:unstable
```
### Access container:
```bash
docker exec -it pomotrick-app sh 
```

## Run Application
### Run Application:
```bash
docker compose up -d
```