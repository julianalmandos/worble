class Vector {
  constructor(
    public x: number,
    public y: number,
  ) {
    this.x = x
    this.y = y
  }

  add(other: Vector): void {
    this.x += other.x
    this.y += other.y
  }

  subtract(other: Vector): void {
    this.x -= other.x
    this.y -= other.y
  }

  multiply(scalar: number): void {
    this.x *= scalar
    this.y *= scalar
  }

  divide(scalar: number): void {
    this.x /= scalar
    this.y /= scalar
  }

  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  normalize(): void {
    const magnitude = this.magnitude()
    this.x /= magnitude
    this.y /= magnitude
  }

  setMagnitude(magnitude: number): void {
    this.normalize()
    this.multiply(magnitude)
  }
}

export default Vector
