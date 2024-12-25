#!/usr/bin/env node

import axios from 'axios'
import { config } from 'dotenv'
import minimist from 'minimist'
import { basename } from 'path'
import lodash from 'lodash'
const { has } = lodash

const argv = minimist(process.argv.slice(2));

const result = config()
if (result.error) {
  result.error.code === 'ENOENT'
    ? console.log('.env file is omitted')
    : console.error('.env error:', result.error)
}

// TODO: use az1.ai domain
const apiUrl = process.env.SELFDEV_API_URL ||
  'https://api.selfdev.vuics.com/v1'
  // 'http://localhost:6368/v1'
const apiKey = process.env.SELFDEV_API_KEY || '<YOUR_KEY>'
const appName = process.env.SELFDEV_APP_NAME || basename(process.argv[1]) || 'selfdev'

const help = `
${appName} <command> [arguments]

Commands:
  ask --prompt='text'
  mail [--from='email'] [--to='email'] --subject='text' --text='text'
  land --body='html' [--title='text'] [--favicon='url'] [--interestForm='true']

Arguments:
  -v - verbose mode

Examples:
  ${appName} ask --prompt='What is self-developing AI?'
  ${appName} mail --to='2@az1.ai' --from='admin@vuics.com' --subject='Email Test' --text='Hello, World!'
  ${appName} land --body='<div>Hello, World!</div>' --title='Title' --favicon='http://oflisback.github.io/react-favicon/img/github.ico' --interestForm='true'
`

const auth = async () => {
  let res = null
  try {
    const [username, password] = apiKey.split(':')
    res = await axios.post(`${apiUrl}/oauth2/token`, {
      grant_type: 'client_credentials',
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username,
        password,
      },
    })
    // console.log('auth res.data:', res.data)
    const tokenType = res.data.token_type
    const token = res.data.access_token
    // console.log('tokenType:', tokenType)
    // console.log('token:', token)
    if (tokenType !== 'Bearer' || !token) {
      throw new Error('Authorization error')
    }
    return token
  } catch (err) {
    console.error('Error:', err)
  }
}

const ask = async ({ accessToken, prompt }) => {
  let res = null
  try {
    res = await axios.post(`${apiUrl}/ask/api`, {
      prompt,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('ask res.data:', res.data)
    return res.data
  } catch (err) {
    console.error('Error:', err)
  }
}

const mail = async ({ accessToken, to, from, subject, text }) => {
  let res = null
  try {
    res = await axios.post(`${apiUrl}/mail/api`, {
      to,
      from,
      subject,
      text,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('mail res.data:', res.data)
    return res.data
  } catch (err) {
    console.error('Error:', err)
  }
}

const land = async ({ accessToken, body, title, favicon, interestForm }) => {
  let res = null
  try {
    res = await axios.post(`${apiUrl}/land/api`, {
      body,
      title,
      favicon,
      interestForm,
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    // console.log('land res.data:', res.data)
    return res.data
  } catch (err) {
    console.error('Error:', err)
  }
}

const main = async () => {
  try {
    let accessToken = null
    const v = argv['v']
    const commands = argv['_']

    v && console.log('Arguments:', argv)

    if (commands.includes('ask')) {
      const prompt = argv['prompt'] || ''

      v && console.log('Ask')
      v && console.log('  prompt:', prompt)
      if (!accessToken) { accessToken = await auth() }
      if (!prompt) { return console.error('Error: No prompt specified.') }
      const { reply } = await ask({
        accessToken,
        prompt,
      })
      v && console.log('Reply:')
      console.log(JSON.stringify(reply))

    } else if (commands.includes('mail')) {
      const to = argv['to'] || ''
      const from = argv['from'] || ''
      const subject = argv['subject'] || ''
      const text = argv['text'] || ''

      v && console.log('Mail')
      v && console.log('  to:', to)
      v && console.log('  from:', from)
      v && console.log('  subject:', subject)
      v && console.log('  text:', text)
      if (!accessToken) { accessToken = await auth() }
      if (!subject) { return console.error('Error: No subject specified.') }
      if (!text) { return console.error('Error: No text specified.') }
      const reply = await mail({
        accessToken,
        from,
        to,
        subject,
        text,
      })
      v && console.log('Reply:')
      console.log(JSON.stringify(reply))

    } else if (commands.includes('land')) {
      const body = argv['body'] || ''
      const title = argv['title'] || ''
      const favicon = argv['favicon'] || ''
      const interestForm = argv['interestForm'] || ''

      v && console.log('Land')
      v && console.log('  body:', body)
      v && console.log('  title:', title)
      v && console.log('  favicon:', favicon)
      v && console.log('  interestForm:', interestForm)
      if (!accessToken) { accessToken = await auth() }
      if (!body) { return console.error('Error: No body specified.') }
      const reply = await land({
        accessToken,
        body,
        title,
        favicon,
        interestForm,
      })
      v && console.log('Reply:')
      console.log(JSON.stringify(reply))

    } else if (commands.includes('help')) {
      console.log(help)

    } else {
      console.log(`No command. Use: ${appName} help`)

    }
  } catch (err) {
    console.error('Error:', err)
  }
}

(() => main())()

