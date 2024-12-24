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

Arguments:
  -v - verbose mode

Examples:
  ${appName} ask --prompt='What is self-developing AI?'
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

const main = async () => {
  try {
    let accessToken = null
    const v = argv['v']
    const commands = argv['_']
    const prompt = argv['prompt'] || ''

    v && console.log('Arguments:', argv)
    v && console.log('Prompt:', prompt)

    if (commands.includes('ask')) {
      v && console.log('Ask')
      if (!accessToken) { accessToken = await auth() }
      if (!prompt) { return console.error('Error: No prompt specified.') }
      const { reply } = await ask({
        accessToken,
        prompt,
      })
      v && console.log('Reply:')
      console.log(reply)

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

