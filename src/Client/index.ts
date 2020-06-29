import feathers from '@feathersjs/feathers'
import authentication, {
  Storage,
  defaultStorage,
} from '@feathersjs/authentication-client'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

interface ClientOptions {
  storage?: Storage
  url: string
}

class Client {
  app: feathers.Application
  socket: SocketIOClient.Socket
  url: string

  constructor(options: ClientOptions) {
    const {
      storage = defaultStorage,
      url,
    } : ClientOptions = options

    this.url = url
    this.socket = io(this.url)

    this.app = feathers()
    this.app
      .configure(socketio(this.socket, {
        timeout: 30000,
      }))
      .configure(authentication({
        path: '/authentication',
        storage,
      }))
  }
}

export default Client
