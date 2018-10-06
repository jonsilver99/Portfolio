/*
    this version has an issue with formating the title line - it breaks up to two lines when the cube
    is small enough to cause a line break
*/



export function initializeParagraph(pElement, text) {
    let formated = text.replace(/[\n\r]+/ig, "")
    formated = formated.split(' ').filter(char => char != '').join(' ')
    $(pElement)
        .empty()
        .text(formated)
}


export function formatText(pElement) {
    let paragraphs = [];
    let words = $(pElement).text().split(' ');
    let paraBegin = 0;
    let paraEnd;

    for (let i = 1; i < words.length; i++) {
        if (words[i] == '*nl') {
            paraEnd = i - 1
            paragraphs.push(words.slice(paraBegin, paraEnd + 1).join(' '))
            paraBegin = i + 1
        }

        if (i >= words.length - 1) {
            paragraphs.push(words.slice(paraBegin, i + 1).join(' '))
            break;
        }
    }

    let lines = []
    paragraphs.forEach((p, i) => lines.push(...paragraphToLines(pElement, p)))

    // wrap each line in a separate <span> tag
    lines.forEach((line, i) => {
        line = lineToLetters(line)
        // style the very first line as a title line
        if (i == 0) $(line).addClass('title-line')

        $(pElement).append(line)
    })
}


export function paragraphToLines(pElement, text, sliceTitle) {

    let para = $(pElement)
    let lines = []

    if (sliceTitle) {
        // If part of the text needs to be a title - slice it from the paragraph and push it as first line
        let titleLine = text.slice(sliceTitle.begin, sliceTitle.end + 1);
        lines.push(titleLine)
        // set rest of the text (without the title) for further handling
        text = text.slice(sliceTitle.end + 1)
    }

    // split text to words
    let words = text.split(' ');
    // initialize the paragraph with the first word 
    para.text(words[0]);
    // this is the paragraph height, whenever it increases - a new line has begun
    let currentHeight = para.height();
    // keep track of lines begin and end index
    let lineBegin = 0;
    let lineEnd;
    let shouldBreakNewLine;

    // create and append the text whilst registering changes in the paragraph element's height - indicating a new line
    for (let i = 1; i < words.length; i++) {
        let wordIsNewLineSymbol = words[i] == '*nl'

        if (wordIsNewLineSymbol) {
            shouldBreakNewLine = true
        }
        else {
            para.text(para.text() + ' ' + words[i]);
            shouldBreakNewLine = para.height() > currentHeight
        }

        if (shouldBreakNewLine) {
            // this means a new line has begun so set lineEnd to be the index of previous word, slice the words array from
            // lineBegin to lineEnd (indexes) and push that as a new line to the lines array
            lineEnd = i - 1
            lines.push(words.slice(lineBegin, lineEnd + 1).join(' '))

            // update the line begin index and paragraph height
            lineBegin = wordIsNewLineSymbol ? i + 1 : i
            currentHeight = para.height();
        }

        // if reached last word push the remaining text to lines, followed by a <br> tag to space it from next line
        if (i >= words.length - 1) {
            lines.push(words.slice(lineBegin, i + 1).join(' '), '<br>')
            break;
        }
    }
    // empty paragraph's flat text
    para.empty();
    return lines
}


export function lineToLetters(line) {
    if (line == '<br>') return line
    line = `<span class='line'>${line}</span> `
    line = $(line)
    let words = line.text().split(' ')

    words = words.map(word => {
        let letters = ``
        for (let i = 0; i < word.length; i++) {
            letters += `<span class='letter'>${word[i]}</span>`
        }
        return letters
    })

    line.empty()
    words.forEach(word => line.append(`<span class='word'>${word}</span> `))
    return line[0]
}