import Client from '.'
import {
  defaultStorage,
} from '@feathersjs/authentication-client'

jest.mock('socket.io-client', () => (): SocketIOClient.Socket => {
  /* eslint-disable */
  const MockedSocket = require('socket.io-mock')

  const socket = <SocketIOClient.Socket>(new MockedSocket())
  socket.io = <SocketIOClient.Manager>{
    timeout(timeout?: number): SocketIOClient.Manager | number {
      if (!timeout) {
        return 1989
      }

      return this
    }
  }

  return socket
  /* eslint-enable */
})

describe('Client', () => {
  it('should initialize a basic client', () => {
    const url = 'https://api-v3.athletes.gg'

    const client = new Client({
      url,
    })

    expect(client.url).toEqual(url)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(client.app.get('storage').storage).toEqual(defaultStorage)
    expect(client.timeout).toEqual(Client.DEFAULT_TIMEOUT)
    expect(client).toMatchSnapshot()
  })

  it('should change sio timeout', () => {
    const timeout = 1989

    const client = new Client({
      url: 'https://taylorswift.com/api',
    })

    expect(client.timeout).toEqual(Client.DEFAULT_TIMEOUT)

    client.timeout = timeout
    expect(client.timeout).toEqual(timeout)
  })

  it('should fail to login (no cached credentials)', async () => {
    const client = new Client({
      url: 'https://taylorswift.com/api',
    })

    await expect(client.login()).rejects.toThrowErrorMatchingSnapshot()
  })

  it('should fail to login (timeout)', async () => {
    const client = new Client({
      url: 'https://taylorswift.com/api',
    })

    await expect(client.login({
      password: 'tayloriscool13',
      username: 'betty',
    })).rejects.toThrowErrorMatchingSnapshot()
  })

  it('should fail to logout (timeout)', async () => {
    const client = new Client({
      url: 'https://taylorswift.com/api',
    })

    await expect(client.logout()).rejects.toThrowErrorMatchingSnapshot()
  })
})
