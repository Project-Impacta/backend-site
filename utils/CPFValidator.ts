/* eslint-disable @typescript-eslint/no-explicit-any */
export class CPFValidator {
  public digits!: number[]
  private firstMultiplier: Array<number> = [10, 9, 8, 7, 6, 5, 4, 3, 2]
  private secondMultiplier: Array<number> = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]

  public handle(data: any): boolean {
    this.digits = this.convertToArray(data)
    return this.tryHandle()
  }

  protected convertToArray(data: any): Array<number> {
    if (typeof data === 'string') return this.convertStringToArrayOfNumbers(data)
    return this.convertNumberToArrayOfNumbers(data)
  }

  private convertStringToArrayOfNumbers(docDigits: string): Array<number> {
    const stringDigits = docDigits.split('')
    const digits = stringDigits.map(el => parseInt(el))
    return digits.filter(el => !isNaN(el))
  }

  private convertNumberToArrayOfNumbers(docDigits: number): Array<number> {
    const docDigitsString = docDigits.toString()
    const stringDigits = docDigitsString.split('')
    return stringDigits.map(el => parseInt(el))
  }

  public tryHandle(): boolean {
    if (this.digits.length !== 11) throw new Error("The document haven't a quantity of characters needed")
    if (!this.calcFirstDigit() || !this.calcSecondDigit()) return false
    return true
  }

  private calcFirstDigit(): boolean {
    const penultDigit: number = this.getPenultDigit()
    const firstNineDigits: Array<number> = this.getFirstNineDigits()
    const resultFirstCalc: number = this.mainAlgorithm(firstNineDigits, this.firstMultiplier)
    return resultFirstCalc === penultDigit
  }

  private getPenultDigit(): number {
    return this.digits.slice(9, -1)[0]
  }

  private getFirstNineDigits(): Array<number> {
    return this.digits.slice(0, 9)
  }

  private calcSecondDigit(): boolean {
    const lastDigit: number = this.getLastDigit()
    const allNumbersButTheLastOne: Array<number> = this.getAllNumbersButTheLastOne()
    const resultSecondCalc: number = this.mainAlgorithm(allNumbersButTheLastOne, this.secondMultiplier)
    return resultSecondCalc === lastDigit
  }

  private getLastDigit(): number {
    return this.digits.slice(10)[0]
  }

  private getAllNumbersButTheLastOne(): Array<number> {
    return this.digits.slice(0, 10)
  }

  private mainAlgorithm(digits: Array<number>, multiplier: Array<number>): number {
    const multiplicationResult: Array<number> = digits.map((el, i) => el * multiplier[i])
    const sumResult: number = multiplicationResult.reduce((acc, cur) => acc + cur)
    const result: number = (sumResult * 10) % 11
    return result === 10 ? 0 : result
  }
}
