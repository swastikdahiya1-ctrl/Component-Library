Copy
import { DottedMap, type Marker } from "@/components/ui/dotted-map"
import type { TCountryCode } from "countries-list"
 
type CountryCode = Lowercase<TCountryCode>
 
type MyMarker = Marker & {
  overlay: {
    countryCode: CountryCode
    label: string
  }
}
 
const markers: MyMarker[] = [
  {
    lat: 37.5665,
    lng: 126.978,
    size: 2.8,
    overlay: { countryCode: "kr", label: "Seoul" },
  },
]
 
<DottedMap<MyMarker>
  markers={markers}
  renderMarkerOverlay={({ marker, x, y, r }) => {
    // Custom overlay rendering
    return <text x={x} y={y}>{marker.overlay.label}</text>
  }}
/>