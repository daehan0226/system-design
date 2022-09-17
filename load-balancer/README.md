### requirements
1. Docker, Docker-compose
2. artillery
  - npm install -g artillery@latest

### run server
  
```javascript

run run-single.sh
run run-multi.sh

```

### run test tool
  
```javascript

artillery run scenarios-single.yaml
artillery run scenarios-multi.yaml

```

### Response comparison
- Condition cpu: 6 core, memory 16GB
- Testing tool - artillery
- The response results can be different depending on hardware, the number of WAS instances, DB, Nginx configuration
  
| total requests (medain 시간(성공/실패))  | 3000  | 9000  | 15000  | 21000  |
|---|---|---|---|---|
|single - /  |   |   |   |   |
|single - cpu  |   |   |   |   |
|single - async io  |   |   |   |   |
|multi(4 WAS instances) - /  | 2ms(3000/0)  |   |   |   |
|multi(4 WAS instances) - cpu  | 56ms(3000/0)  | 4770.6(1064/7936)   |   |   |
|multi(4 WAS instances) - async io  |  2018.7(3000/0) | 2018.7(8854/146)  |   |   |
|   |   |   |   |   |