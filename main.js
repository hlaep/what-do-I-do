const shownText = document.getElementById('dialogue-box')
const choiceField = document.getElementById('button-container')

let playerName = null

let currentLine = 5
let dialogueDone = true

const lines = [
  {
    text: 'You wake up on a place that seems like a kitchen.'
  },
  {
    text: "You've never seen this place."
  },
  {
    text: "There's a girl with an uniform next to you."
  },
  {
    text: 'Hey!',
    character: 'waitress'
  },
  {
    text: "I'm lost, that's the only thing I remember."
  },
  ['Where am I?', "I also can't remember anything!", 'Who are you?']
]

const displayText = (text, character) => {
  dialogueDone = false
  switch (character) {
    case 'waitress':
      shownText.style.color = 'red'
      break
  }

  let currentIndex = 0

  const nextLetter = () => {
    if (currentIndex < text.length) {
      shownText.innerHTML += text[currentIndex]
      currentIndex++
      setTimeout(nextLetter, Math.random() * 70)
    } else {
      dialogueDone = true
    }
  }
  nextLetter()
}

const showChoice = options => {
  dialogueDone = false
  choiceField.innerHTML = options
    .map(option => `<button choice-button>${option}</button>`)
    .join('')
  const choiceButtons = document.querySelectorAll('[choice-button]')
  choiceButtons.forEach(button =>
    button.addEventListener('click', () => choose(button.textContent))
  )
}

const choose = chosenOption => {
  const addLine = line => lines.splice(currentLine, 0, line)
  const addLines = texts =>
    texts.forEach((line, i) => lines.splice(currentLine + i, 0, line))
  // First choice
  switch (chosenOption) {
    case 'Who are you?':
      addLines([
        {
          text: [
            "I'm Alisson. ",
            'Do you remember your name?',
            () => showNameInput()
          ]
        },
        { text: () => ` alright ${playerName}` }
      ])
      break
    case 'Where am I?':
      addLine({
        text: [
          "I don't know. ",
          'But I know we need to serve the guests in this event, ',
          'otherwise... ',
          "You'll feel a lot of pain."
        ]
      })
      break
}

  console.log(lines)
  choiceField.innerHTML = ''
  dialogueDone = true
}

const setPlayerName = name => {
  playerName = name
}

const showNameInput = () => {
  dialogueDone = false
  const nameInput = document.createElement('input')
  nameInput.setAttribute('autofocus', 'true')
  choiceField.appendChild(nameInput)
  nameInput.addEventListener('keydown', event => {
    if (event.keyCode === 13) {
      playerName = nameInput.value
      choiceField.innerHTML = ''
      return currentLine++, nextLine()
    }
  })
}

const nextLine = () => {
  if (!dialogueDone) return
  if (Array.isArray(lines[currentLine])) {
    showChoice(lines[currentLine], currentLine)
    return currentLine++
  }
  if (typeof lines[currentLine].text === 'function') {
    displayText(lines[currentLine].text())
  }
  shownText.innerText = ''
  displayText(lines[currentLine].text, lines[currentLine].character)
  currentLine++
}

let i = 0
window.addEventListener('click', () => {
  if (typeof lines[currentLine].text === 'object') {
    if (i === 0) shownText.innerText = ''
    if (typeof lines[currentLine].text[i] === 'function') {
      lines[currentLine].text[i]()
    }
    if (!lines[currentLine].text[i]) return currentLine++, nextLine()
    displayText(lines[currentLine].text[i])
    return i++
  }
  return nextLine()
})


