import feathers, {
  Application,
  Query,
  Service,
} from '@feathersjs/feathers'
import type {
  AuthenticationRequest,
  AuthenticationResult,
} from '@feathersjs/authentication'
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

  readonly app: Application
  readonly socket: SocketIOClient.Socket

  private _timeout: number
  private _url: string

  public authManagement: Service<any>
  public activities: Service<any>
  public characters: Service<any>
  public events: Service<any>
  public featured: Service<any>
  public followers: Service<any>
  public images: Service<any>
  public games: Service<any>
  public matches: Service<any>
  public notifications: Service<any>
  public placings: Service<any>
  public schedules: Service<any>
  public users: Service<any>

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

  private getService(service: string): Service<any> {
    return this.app.service(service) as Service<any>
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

  public async login(credentials?: AuthenticationRequest): Promise<AuthenticationResult> {
    return this.app.authenticate(credentials)
  }

  public async logout(): Promise<AuthenticationResult | null> {
    return this.app.logout()
  }

  // GET
  public async getCharacter(id: string): Promise<Record<string, unknown>> {
    return this.characters.get(id) as Promise<Record<string, unknown>>
  }

  public async getCharacters(query: Query): Promise<Record<string, unknown>[]> {
    return this.characters.find({
      query,
    }) as Promise<Record<string, unknown>[]>
  }

  public async getGame(id: string): Promise<Record<string, unknown>> {
    return this.games.get(id) as Promise<Record<string, unknown>>
  }

  public async getGames(query: Query): Promise<Record<string, unknown>[]> {
    return this.games.find({
      query,
    }) as Promise<Record<string, unknown>[]>
  }

  public async getMatch(id: string): Promise<Record<string, unknown>> {
    return this.matches.get(id) as Promise<Record<string, unknown>>
  }

  public async getMatches(query: Query): Promise<Record<string, unknown>[]> {
    return this.matches.find({
      query,
    }) as Promise<Record<string, unknown>[]>
  }

  public async getUser(id: string): Promise<Record<string, unknown>> {
    return this.users.get(id) as Promise<Record<string, unknown>>
  }

  public async getUsers(query: Query): Promise<Record<string, unknown>[]> {
    return this.users.find({
      query,
    }) as Promise<Record<string, unknown>[]>
  }
}

export default Client
