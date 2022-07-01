# How to install selenoid on windows


### Step download

- Download and install [cm.exe](https://github.com/aerokube/cm/releases) from GitHub
- Rename downloaded file to cm.exe

### Step installation

- Open in folder with cm.exe console and run commands

```console
./cm selenoid start --force --browsers 'firefox;chrome;' --last-versions 2 --args "-session-attempt-timeout 2m -service-startup-timeout 2m"
```
- Wait a little while the selenoid and browsers are installed and launched
- Run next console command to run UI
```console
./cm.exe selenoid-ui start
```

### Step use

- Go to url in localhost [http://localhost:8080/#/capabilities/](http://localhost:8080/#/capabilities/)
- You must see this page, now we can run tests in Selenoid

![](https://i.imgur.com/UuwTUav.png)