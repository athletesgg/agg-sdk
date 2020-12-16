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
import _ from 'lodash'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

interface ClientOptions {
  pageLimit?: number
  pageSizeLimit?: number
  storage?: Storage
  timeout?: number
  tryLimit?: number
  url: string
}

class Client implements ClientOptions {
  static DEFAULT_PAGE_LIMIT = 5
  static DEFAULT_PAGE_SIZE_LIMIT = 50
  static DEFAULT_TIMEOUT = 3000
  static DEFAULT_TRY_LIMIT = 3

  readonly app: Application
  readonly socket: SocketIOClient.Socket

  private _pageLimit: number
  private _pageSizeLimit: number
  private _timeout: number
  private _tryLimit: number
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
      pageLimit = Client.DEFAULT_PAGE_LIMIT,
      pageSizeLimit = Client.DEFAULT_PAGE_SIZE_LIMIT,
      storage = defaultStorage,
      timeout = Client.DEFAULT_TIMEOUT,
      tryLimit = Client.DEFAULT_TRY_LIMIT,
      url,
    } : ClientOptions = options

    this._pageLimit = pageLimit
    this._pageSizeLimit = pageSizeLimit
    this._url = url
    this._timeout = timeout
    this._tryLimit = tryLimit
    this.socket = io(this._url)

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

  public disconnect(): void {
    this.socket.disconnect()
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

  // MACROS
  public async findPaginate(
    service: string,
    buildQuery: (lastItem?: Record<string, unknown>) => Query,
    job: (data?: Record<string, unknown>[]) => Promise<void> | void,
    pageLimit: number = this._pageLimit,
    lastItem?: Record<string, unknown>,
    tries = 0,
    pages = 1,
  ): Promise<void> {
    const query: Query = {
      $limit: this._pageSizeLimit,
      ...buildQuery(lastItem),
    } as Query

    try {
      const data: Record<string, unknown>[] = await this.getService(service).find({
        query,
      }) as Record<string, unknown>[]

      await job(data)

      if (data.length < this._pageSizeLimit) {
        return
      }

      if (pages >= pageLimit) {
        return
      }

      return this.findPaginate(
        service,
        buildQuery,
        job,
        pageLimit,
        _.last(data) as Record<string, unknown>,
        0,
        pages + 1,
      )
    } catch (error) {
      if (tries >= this._tryLimit) {
        throw error
      }

      return this.findPaginate(
        service,
        buildQuery,
        job,
        pageLimit,
        lastItem,
        tries + 1,
        pages,
      )
    }
  }
}

export default Client
