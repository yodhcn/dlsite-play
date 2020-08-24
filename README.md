# dlsite-play

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

#### 注意
如果不想另搭后端，想只利用 [DLsite Play](https://play.dlsite.com/) 的后端进行测试 (实际上本项目就是这样配置的)，那么你只需要在 [vue.config.js](https://github.com/yodhcn/dlsite-play/blob/master/vue.config.js) 中修改下面这两个 2 个常量。
##### 1. PROXY
由于 DLSite 在某些国家或地区无法直连，因此需要设置代理。
PROXY 可以是一个 http 或 https 代理 (例如: ```const PROXY = 'http://127.0.0.1:10809'```)，若不想使用代理，可将 PROXY 设为 ```null```。

##### 2. SID
由于应用本身没有登录页面, 因此需要手动配置 SID。
DLsite 将 SessionID 存储在 Cookie 中，在登录 [DLsite](https://www.dlsite.com/maniax/) 后, 在网站 Cookie 中找到键名为 ```__DLsite_SID``` 对应的值，这个值就是 DLsite 网站的 SessionID。
