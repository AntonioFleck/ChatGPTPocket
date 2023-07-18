const askInput = document.getElementById('askInput')

const OPENAI_API_KEY = localStorage.getItem('OPENAI_API_KEY')

const messages = JSON.parse(localStorage.getItem('chat')) || []

async function ask() {
    const chat = document.getElementById('chatContent')
    let question = {
        sender: 'user',
        text: askInput.value
    }

    askInput.value = 'Loading....'
    askInput.disabled = true
    const loadingMessage = document.getElementById('loadingMessage')
    loadingMessage.style.display = 'flex'

    renderMessage(question.sender, question.text)
    chat.scrollTop = chat.scrollHeight

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: question.text,
            max_tokens: 2048,
            temperature: 0.5
        })
    })

    const responseJson = await response.json()
    console.log(responseJson)
    let answer = {
        sender: 'GPT',
        text: responseJson.choices[0].text
    }

    loadingMessage.style.display = 'none'
    renderMessage(answer.sender, answer.text)

    askInput.value = ''
    askInput.disabled = false
    chat.scrollTop = chat.scrollHeight

    messages.push(question,answer)
    localStorage.setItem('chat', JSON.stringify(messages))
}

function renderMessage (sender, text) {
    const chat = document.getElementById('chat')
    
    const messageContainer = document.createElement('div')
    messageContainer.classList.add('messageContainer')
    
    const profilePic = document.createElement('img')
    profilePic.alt = 'profilePic'
    profilePic.classList.add('profilePic')

    const message = document.createElement('p')
    message.classList.add('message')
    message.textContent = text

    if(sender === 'GPT') {
        messageContainer.classList.add('GPTMessage')
        profilePic.src = 'imgs/chatgpt.png'
    } else {
        profilePic.src = 'imgs/profilepic.png'
    }

    messageContainer.append(profilePic, message)
    chat.append(messageContainer)
}

askInput.addEventListener('keypress', async (e) => {
    if(askInput.value && e.key === 'Enter') {
        await ask()
    }
})

const configBtn = document.getElementById('configBtn')
let configToggle = 0
const config = document.getElementById('config')
const main = document.getElementById('main')


configBtn.addEventListener('click', () => {
    const chat = document.getElementById('chatContent')
    
    if(configToggle === 0) {
    configBtn.textContent = '❌'
    configToggle = 1
    main.style.display = 'none'
    config.style.display = 'flex'
   } else {
    configBtn.textContent = '⚙️'
    configToggle = 0
    main.style.display = 'block'
    config.style.display = 'none'
    chat.scrollTop = chat.scrollHeight
   }
})

const saveKeyBtn = document.getElementById('saveKey')

saveKeyBtn.addEventListener('click', () => {
    const keyInput = document.getElementById('OPENAI_API_KEY').value
    localStorage.setItem('OPENAI_API_KEY', keyInput)
    OPENAI_API_KEY = keyInput
    configBtn.textContent = '⚙️'
    configToggle = 0
    main.style.display = 'block'
    config.style.display = 'none'
})

document.addEventListener('DOMContentLoaded', () => {
    if(OPENAI_API_KEY) {
        configBtn.textContent = '⚙️'
        main.style.display = 'block'
        config.style.display = 'none'
        configBtn.disabled = false
        document.getElementById('OPENAI_API_KEY').value = OPENAI_API_KEY
    } else {
        main.style.display = 'none'
        config.style.display = 'flex'
        configBtn.disabled = true
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const chat = document.getElementById('chatContent')
    messages.forEach((m) => {
    renderMessage(m.sender, m.text);
    chat.scrollTop = chat.scrollHeight;
    });
  });
  

document.getElementById('clearBtn').addEventListener('click', () => {
    localStorage.setItem('chat', JSON.stringify([]))
    location.reload()
})