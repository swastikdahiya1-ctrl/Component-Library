Copy
import type { TCountryCode } from "countries-list"
 
type CountryCode = Lowercase<TCountryCode>
 
type MyMarker = Marker & {
  overlay: {
    countryCode: CountryCode
    label: string
  }
}
;<DottedMap<MyMarker> markers={markers} />