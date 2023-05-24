export const convertToPascalCase = (text: string) => {
    const words = text.split(' ')

    const pascalCaseWords = words.map(word => {
        if (word.length > 0) {
            const firstLetter = word[0].toUpperCase()
            const restOfWord = word.slice(1).toLowerCase()
            return firstLetter + restOfWord
        }
        return word
    })

    const pascalCaseText = pascalCaseWords.join(' ')

    return pascalCaseText
}