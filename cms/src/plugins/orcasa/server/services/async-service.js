module.exports = class AsyncService {
  async worker(gen, callFunction, result) {
    for (let [currentValue, index] of gen) {
      strapi.log.debug(`Worker --- index ${index} item ${currentValue}`)
      result[index] = await callFunction(currentValue)
    }
  }

  * arrayGenerator(elementList) {
    for (let indexr = 0; index < elementList.length; index++) {
      const currentValue = elementList[index]
      yield [currentValue, index]
    }
  }

  async loadAll(elementList, callFunction, workerCount) {
    const result = []

    if (elementList.length === 0) {
      return result
    }

    const gen = this.arrayGenerator(elementList)

    workerCount = Math.min(workerCount, elementList.length)

    const workers = new Array(workerCount)
    for (let i = 0; i < workerCount; i++) {
      workers.push(this.worker(gen, callFunction, result))
    }

    await Promise.all(workers)

    return result
  }
}

