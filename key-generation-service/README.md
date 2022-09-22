### KGS(Key Generation Service)
- KGS can be very useful when unique value is needed and we dont have to worry about duplications or collisions.
- Two tables for used and not used values and save some values in memory for better performance.
- when you load the values to memory, move them to the used table.
- KGS also has to make sure not to give the same key to multiple servers. For that, it must synchronize (or get a lock on) the data structure holding the keys before removing keys from it and giving them to a server.

# Implementaion
1. create table if not exists: use, used keys(column - key)
2. main-WAS-instance: create 4 letters values(a-z,A-Z,0-9) -> 26 + 26 + 10 = 62**3 = 238,328 cases
   1. 1 bytes hold 1 character (ASCII) 1 bytes = 8bits, 1~8bits = 2*7 - 128 => 1 letter = 1byte, 3 bytes * 238,328 = 714,984 bytes = 700KB
3. (LOCK)get keys save some in memory(not shared, seperate in each WAS instance), move them to used keys table

# API
1. api - get: get one key from memory(return the key and update the memory), get from DB if not in memory
2. api - delete(key): move key from used table to use table


3. Set .env file based on your requirements

```javascript
/**
 * @public
 * @see https://docs.mongodb.org/manual/reference/command/collStats/
 */
export declare interface CollStats extends Document {
    /** Namespace */
    ns: string;
    /** Number of documents */
    count: number;
    /** Collection size in bytes */
    size: number;
    /** Average object size in bytes */
    avgObjSize: number;
    /** (Pre)allocated space for the collection in bytes */
    storageSize: number;
    /** Number of extents (contiguously allocated chunks of datafile space) */
    numExtents: number;
    /** Number of indexes */
    nindexes: number;
    /** Size of the most recently created extent in bytes */
    lastExtentSize: number;
    /** Padding can speed up updates if documents grow */
    paddingFactor: number;
    /** A number that indicates the user-set flags on the collection. userFlags only appears when using the mmapv1 storage engine */
    userFlags?: number;
    /** Total index size in bytes */
    totalIndexSize: number;
    /** Size of specific indexes in bytes */
    indexSizes: {
        _id_: number;
        [index: string]: number;
    };
    /** `true` if the collection is capped */
    capped: boolean;
    /** The maximum number of documents that may be present in a capped collection */
    max: number;
    /** The maximum size of a capped collection */
    maxSize: number;
    /** This document contains data reported directly by the WiredTiger engine and other data for internal diagnostic use */
    wiredTiger?: WiredTigerData;
    /** The fields in this document are the names of the indexes, while the values themselves are documents that contain statistics for the index provided by the storage engine */
    indexDetails?: any;
    ok: number;
    /** The amount of storage available for reuse. The scale argument affects this value. */
    freeStorageSize?: number;
    /** An array that contains the names of the indexes that are currently being built on the collection */
    indexBuilds?: number;
    /** The sum of the storageSize and totalIndexSize. The scale argument affects this value */
    totalSize: number;
    /** The scale value used by the command. */
    scaleFactor: number;
}


// 3 letters AAA ~ 999 - keys
{ 
   "ns": "kgs.keys",
   "size": 6434856, // count * avgObjSize Collection size in bytes
   "count": 238328,
   "avgObjSize": 27,  // 3 letters needs 3bytes and 24 bytes will be for other things
   "storageSize": 2465792, // (Pre)allocated space for the collection in bytes
   "freeStorageSize": 241664, // /** The amount of storage available for reuse. The scale argument affects this value. */
   "indexBuilds": [],
   "totalIndexSize": 3092480, 
   "totalSize": 5558272,
   "indexSizes": {
      "_id_": 3092480
   },
   "scaleFactor": 1,
   "ok": 1
}
// 2 letters AA ~ 99 - two letter keys
{       
   "ns": "kgs.twoletterkeys",
   "size": 99944, // count * avgObjSize = Collection size in bytes == total
   "count": 3844,
   "avgObjSize": 26, // 2 letters needs 2bytes and 24 bytes will be for other things
   "storageSize": 53248,  // (Pre)allocated space for the collection in bytes = 52kb
   "freeStorageSize": 0,
   "indexBuilds": [],
   "totalIndexSize": 57344,
   "totalSize": 110592, // The sum of the storageSize and totalIndexSize
   "indexSizes": {
      "_id_": 57344 
   },
   "scaleFactor": 1,
   "ok": 1
}

// 1 letter A ~ 9 - one letter keys
{
   "ns": "kgs.oneletterkeys",
   "size": 1550,  // count * avgObjSize = Collection size in bytes
   "count": 62,
   "avgObjSize": 25, // 1 letter needs 1byte and 24 bytes will be for other things /
   "storageSize": 20480, // 20kb
   "freeStorageSize": 0,
   "indexBuilds": [],
   "totalIndexSize": 20480,
   "totalSize": 40960,
   "indexSizes": {
      "_id_": 20480
   },
   "scaleFactor": 1,
   "ok": 1
}

```
