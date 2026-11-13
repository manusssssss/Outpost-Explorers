// Units in the surface scene are metres and seconds. This is a simple
// vertical-motion model, not a complete spacesuit or vehicle simulation.
export const GRAVITY = Object.freeze({ Moon: 1.62, Mars: 3.71 });
export function gravityFor(world) {
  return GRAVITY[world] ?? GRAVITY.Moon;
}
export function advanceVertical(y, velocity, ground, gravity, dt) {
  const nextY = y + velocity * dt - 0.5 * gravity * dt * dt;
  const nextVelocity = velocity - gravity * dt;
  if (nextY <= ground && nextVelocity <= 0) {
    return { y: ground, velocity: 0, grounded: true };
  }
  return { y: Math.max(nextY, ground), velocity: nextVelocity, grounded: false };
}
