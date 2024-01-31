export default abstract class AsyncService {
  private async worker(gen: Generator<Array<number>>, callFunction: (arg: any) => Promise<Record<string, any>>, result: Array<Record<string, any>>): Promise<void> {
    for (let [currentValue, index] of gen) {
      strapi.log.debug(`Worker --- index ${index} item ${currentValue}`)
      result[index] = await callFunction(currentValue)
    }
  }

  private* arrayGenerator(elementList: Array<any>): Generator<Array<number>> {
    for (let index: number = 0; index < elementList.length; index++) {
      const currentValue = elementList[index]
      yield [currentValue, index]
    }
  }

  protected async loadAll(elementList: Array<any>, callFunction: (arg: any) => Promise<Record<string, any>>, workerCount: number): Promise<Array<any>> {
    const result: Array<any> = []

    if (elementList.length === 0) {
      return result
    }

    const gen: Generator<Array<number>> = this.arrayGenerator(elementList)

    workerCount = Math.min(workerCount, elementList.length)

    const workers: any[] = new Array(workerCount)
    for (let i = 0; i < workerCount; i++) {
      workers.push(this.worker(gen, callFunction, result))
    }

    await Promise.all(workers)

    return result
  }
}

