class NumberSelection {
  constructor(n) {
    this.n = n
    this.selected = ko.observable(false)
  }

  select() {
    if (this.selected()) {
      return false
    }
    else {
      this.selected(true)
      return true
    }
  }

  display() {
    return `${this.n + 1}`
  }
}

class NumberSelectionLine {
  constructor(start) {
    this.line = []
    for (let i = start; i < start + 10; i++) {
      this.line.push(new NumberSelection(i))
    }
  }

  select(n) {
    return this.line[n].select()
  }
}

class NumberSelections {
  constructor() {
    let a = []
    for (let i = 0; i < 100; i += 10) {
      a.push(new NumberSelectionLine(i))
    }

    this.lines = a
  }

  select(n) {
    this.lines[Math.floor(n / 10)].select(n % 10)
  }
}

let viewModel = {
  selector: ko.observable('??'),
  selections: new NumberSelections(),
}

function rnd(min, max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min
}

const numbers = []
for (let i = 0; i < 100; i++) {
  numbers.push(i)
}

function nextNumber() {
  return numbers[rnd(0, numbers.length - 1)]
}

function changeSelectorText(n) {
  viewModel.selector('' + (n + 1))
}

const app = document.querySelector('#app')
let timer = null
function onAction() {
  if (numbers.length) {
    if (timer) {
      clearInterval(timer)
      const n = nextNumber()
      numbers.splice(numbers.indexOf(n), 1)
      if (numbers.length) {
        changeSelectorText(n)
      }
      else {
        viewModel.selector('おしまい')
      }
      viewModel.selections.select(n)
      timer = null
    }
    else {
      timer = setInterval(() => {
        changeSelectorText(nextNumber())
      }, 1)
    }
  }
}

app.addEventListener('keyup', (e) => {
  if (e.keyCode === 13 || e.keyCode === 32) {
    onAction()
  }
})

app.addEventListener('mouseup', () => {
  onAction()
})

ko.applyBindings(viewModel)