if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return i
      }
    }
    return -1
  }
}

if (!Number.isFinite) {
  Number.isFinite =
    Number.isFinite ||
    function(any) {
      return typeof any === 'number' && isFinite(any)
    }
}

// console.time implementation for IE
if (window.console && typeof window.console.time == 'undefined') {
  console.time = function(name, reset) {
    if (!name) {
      return
    }
    var time = new Date().getTime()
    if (!console.timeCounters) {
      console.timeCounters = {}
    }
    var key = 'KEY' + name.toString()
    if (!reset && console.timeCounters[key]) {
      return
    }
    console.timeCounters[key] = time
  }

  console.timeEnd = function(name) {
    var time = new Date().getTime()
    if (!console.timeCounters) {
      return
    }
    var key = 'KEY' + name.toString()
    var timeCounter = console.timeCounters[key]
    var diff
    if (timeCounter) {
      diff = time - timeCounter
      var label = name + ': ' + diff + 'ms'
      console.info(label)
      delete console.timeCounters[key]
    }
    return diff
  }
}
