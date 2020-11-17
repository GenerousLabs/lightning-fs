const AsyncStorage = require('@react-native-async-storage/async-storage')

module.exports = class AsyncStorageBackend {
  constructor(dbname, storename) {
    this._database = dbname;
    this._storename = storename;
  }
  _key(key) {
    return `${this._database}:${this._storename}:${key}`
  }
  _encode(data) {
    return Buffer.from(data).toString('utf8')
  }
  _decode(data) {
    return Buffer.from(data, 'utf8')
  }
  saveSuperblock(superblock) {
    return AsyncStorage.setItem(this._key("!root"), this._encode(superblock))
  }
  loadSuperblock() {
    return AsyncStorage.getItem(this._key("!root")).then(this._decode);
  }
  readFile(inode) {
    return AsyncStorage.getItem(this._key(inode)).then(this._decode)
  }
  writeFile(inode, data) {
    return AsyncStorage.setItem(this._key(inode), this._encode(data))
  }
  unlink(inode) {
    return AsyncStorage.removeItem(this._key(inode))
  }
  wipe() {
    return AsyncStorage.getAllKeys().then(async keys => {
      await Promise.all(keys.map(key => {
        if (key.startsWith(`${this._database}:${this._storename}:`)) {
          return AsyncStorage.removeItem(key)
        }
      })
    })
  }
  close() {
    return Promise.resolve()
  }
}
