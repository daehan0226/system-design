### KGS(Key Generation Service)
- KGS can be very useful when unique value is needed and we dont have to worry about duplications or collisions.
- Two tables for used and not used values and save some values in memory for better performance.
- when you load the values to memory, move them to the used table.
- KGS also has to make sure not to give the same key to multiple servers. For that, it must synchronize (or get a lock on) the data structure holding the keys before removing keys from it and giving them to a server.

# Implementaion
1. create table if not exists: use, used keys(column - key)
2. main-WAS-instance: create 4 letters values(a-z,A-Z,0-9) -> 26 + 26 + 10 = 62**5 = 916,132,832 cases
   1. 1 bytes hold 1 character (ASCII) 1 bytes = 8bits, 1~8bits = 2*7 - 128 => 5 letters -> 5bytes = 4.26GB
3. (LOCK)get keys save some in memory(not shared, seperate in each WAS instance), move them to used keys table

# API
1. api - get: get one key from memory(return the key and update the memory), get from DB if not in memory
2. api - delete(key): move key from used table to use table


3. Set .env file based on your requirements

```javascript

```