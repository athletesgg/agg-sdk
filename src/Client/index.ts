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
  public authenticate
  public authManagement: feathers.Service<any>
  public activities: feathers.Service<any>
  public characters: feathers.Service<any>
  public events: feathers.Service<any>
  public featured: feathers.Service<any>
  public followers: feathers.Service<any>
  public images: feathers.Service<any>
  public games: feathers.Service<any>
  public matches: feathers.Service<any>
  public notifications: feathers.Service<any>
  public placings: feathers.Service<any>
  public schedules: feathers.Service<any>
  public users: feathers.Service<any>

  public constructor(options: ClientOptions) {
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

    this.authenticate = this.app.authenticate
    this.authManagement = this.getService('authManagement')
    this.activities = this.getService('activities')
    this.characters = this.getService('characters')
    this.events = this.getService('events')
    this.featured = this.getService('featured')
    this.followers = this.getService('followers')
    this.images = this.getService('images')
    this.games = this.getService('games')
    this.matches = this.getService('matches')
    this.notifications = this.getService('notifications')
    this.placings = this.getService('placings')
    this.schedules = this.getService('schedules')
    this.users = this.getService('users')
  }

  public get timeout(): number {
    return this._timeout
  }

  public set timeout(timeout: number) {
    this.socket.io.timeout(timeout)

    this._timeout = timeout
  }

  public get url(): string {
    return this._url
  }

  private getService(service: string): feathers.Service<any> {
    return this.app.service(service) as feathers.Service<any>
  }
}

export default Client
