import Client from '.'
import {
  defaultStorage,
} from '@feathersjs/authentication-client'

jest.mock('socket.io-client', () => (): SocketIOClient.Socket => {
  /* eslint-disable */
  const MockedSocket = require('socket.io-mock')

  return <SocketIOClient.Socket>(new MockedSocket())
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
})
