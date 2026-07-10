Copy
interface SpringConfig {
  damping: number // Controls how quickly the animation settles
  stiffness: number // Controls the spring stiffness
  mass: number // Controls the virtual mass of the animated object
  restDelta: number // Controls the threshold at which animation is considered complete
}