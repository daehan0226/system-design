### Requirements
1. Docker, Docker-compose
2. artillery
  - npm install -g artillery@latest

### Run server
  
```javascript

run single/run.sh
run multi/run.sh

```

### Run test tool
  
```javascript

artillery run scenarios-single.yaml
artillery run scenarios-multi.yaml

```

### Response comparison
- Condition cpu: 6 core, memory 16GB
- Testing tool - artillery
- The response results can be different depending on hardware, the number of WAS instances, DB, Nginx configuration
- 100, 300, 500 requests per second for 30 seconds 
- cpu - count up to 10000
- io - settimout 2 seconds

| total requests (medain time(ms),(completed/failed))  | 3000  | 9000 | 15000
|---|---|---|---|
|single -  | 2ms(3000/0)  |  2ms(9000/0) | 1720ms(13186/1814) |
|single - cpu  |  ***5168ms(801/2199)*** | 4965ms(306/8694)  | |
|single - async io  |  2018.7ms(3000/0) | 2018.7ms(8654/346)  | |
|multi(4 WAS instances)  | 2ms(3000/0)  | 2ms(9000/0)  | ***1826ms(11435/3565)*** |
|multi(4 WAS instances) - cpu  | ***41ms(3000/0)***  | 4770.6(1064/7936)   | |
|multi(4 WAS instances) - async io  |  2018.7ms(3000/0) | 2018.7ms(8854/146)  | |
|   |   |   |   |   |

* There is a big difference when its for cpu intensive jobs
  * when 3000 requests, it took about 5000ms and only about 800 requests are completed for the single instance whereas there is 0 failure and it took 41ms for the multiple instaces.
* For calling apis that do not implement any code(cpu/io bound job or etc), single instance showed the better performance. 
* The failure rate increases as there are more requests for both cases(cpu/io) which is obvious
