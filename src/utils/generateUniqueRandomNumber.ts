let previousNumber = -1

export function generateUniqueRandomNumber() {
    let randomNumber: number

    do {
        randomNumber = Math.floor(Math.random() * 100) + 1
        console.log(previousNumber, randomNumber)
    } while (randomNumber === previousNumber)

    previousNumber = randomNumber

    return randomNumber
}
