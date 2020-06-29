interface ClientOptions {
  url: string
}

class Client {
  url: string

  constructor(options: ClientOptions) {
    this.url = options.url
  }
}

export default Client
