export function corsProxy(url: string): string {
  //
  // this one is locked down
  // const proxy = 'https://cors-anywhere.herokuapp.com/'

  // this one requires an app id
  // const proxy = `https://cors.bridged.cc/`

  // this requires hard coding the whitelist
  // const proxy = `https://cors-server-parkerhill.vercel.app/`

  // * this one seems to work
  // const proxy = `https://corsanywhere.herokuapp.com/`

  // * this mine, seems to work
  const proxy = `https://parkerhill-cors-anywhere.herokuapp.com/`

  return proxy + url
}

// https://github.com/Rob--W/cors-anywhere/issues/39#issuecomment-628930502
// eg <img crossOrigin="anonymous" referrerPolicy="origin" src="URL" />
export const imgCorsParams = `crossOrigin="anonymous" referrerPolicy="origin"`
