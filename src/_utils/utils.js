class utilities {

  dateFromTimeStamp = (timestamp) => {
    const day = ("0" + timestamp.getDate()).slice(-2)
    const month = ("0" + (timestamp.getMonth() + 1)).slice(-2)
    function addZero(i) {
      return (i < 10) ? "0" + i : i;
    }
    return timestamp.getFullYear() + '-' + month + '-' + day + ' ' + addZero(timestamp.getHours()) + ':' + addZero(timestamp.getMinutes()) + ':' + addZero(timestamp.getSeconds())
  }

  shallowEqual(objA: mixed, objB: mixed): boolean {
    // const sourceLogClass = this.constructor.name
    if (objA === objB) {
      // console.log(`${sourceLogClass} -> objA === objB`)
      return true;
    }

    if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
      // console.log(`${sourceLogClass} -> objA !== 'object'`)
      return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      // console.log(`${sourceLogClass} -> keysA.length`);
      return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        // console.log(`${sourceLogClass} -> Test for A's keys different from B`)
        return false;
      }
    }
    return true;
  }
}

var utils = new utilities();

export default utils;