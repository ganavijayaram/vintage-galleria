import nats, {Stan} from 'node-nats-streaming'

// This is singleton class
class NatsWrapper {
  //al propertiies of teh class are usually initialised in the constructor
  // ? means we will leave it uninitialised for a while
  private _client? : Stan
c
  get client() {
    // this is set only if connect is called before
    if(!this._client) {
      throw new Error('Cannot access NATS client before connecting to NATS')
    }
    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client =  nats.connect(clusterId, clientId, {url})

    // when we call connect function in other files, we want to be able to use await 
    // to wait till the connection happens before we move on to the next code
    return new Promise<void>((resolve, reject) => {
      this.client!.on('connect', () => {
        console.log('Client: Conneted to NATS')
        resolve()
      })
      this.client!.on('error', (err) => {
        console.log('Client: NotConneted to NATS')
          reject(err)
      })
    })
  }
}

// we are going to initiliase this in index, and use the same instance in al the other files
//this is singleton beacuse we have exported teh class
export const natsWrapper = new NatsWrapper()