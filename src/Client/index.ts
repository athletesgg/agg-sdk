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

  readonly app: feathers.Application
  readonly socket: SocketIOClient.Socket
  private _timeout: number
  private _url: string

  constructor(options: ClientOptions) {
    const {
      storage = defaultStorage,
      timeout = Client.DEFAULT_TIMEOUT,
      url,
    } : ClientOptions = options

    this._url = url
    this.socket = io(this._url)
    this._timeout = timeout

    this.app = feathers()
    this.app
      .configure(socketio(this.socket, {
        timeout: this._timeout,
      }))
      .configure(authentication({
        path: '/authentication',
        storage,
      }))
  }

  get timeout(): number {
    return this._timeout
  }

  set timeout(timeout: number) {
    this.socket.io.timeout(timeout)

    this._timeout = timeout
  }

  get url(): string {
    return this._url
  }
}

export default Client
