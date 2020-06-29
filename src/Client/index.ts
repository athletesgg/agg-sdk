import feathers from '@feathersjs/feathers'
import authentication, {
  Storage,
  defaultStorage,
} from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

interface ClientOptions {
  storage?: Storage
  timeout?: number
  url: string
}

class Client implements ClientOptions {
  static DEFAULT_TIMEOUT = 3000

  app: feathers.Application
  socket: SocketIOClient.Socket
  timeout: number
  url: string

  constructor(options: ClientOptions) {
    const {
      storage = defaultStorage,
      timeout = Client.DEFAULT_TIMEOUT,
      url,
    } : ClientOptions = options

    this.url = url
    this.socket = io(this.url)
    this.timeout = timeout

    this.app = feathers()
    this.app
      .configure(socketio(this.socket, {
        timeout: this.timeout,
      }))
      .configure(authentication({
        path: '/authentication',
        storage,
      }))
  }
}

export default Client
