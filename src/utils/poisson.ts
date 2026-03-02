import Vector from './vector'

type Row = Array<Vector | number>

interface PoissonDiskOptions {
  K?: number
}

/**
 * Poisson Disk Sampling implementation, based on the enhancements made by Robert Bridson.
 * @see https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
 *
 * @param width - The width of the grid
 * @param height - The height of the grid
 * @param radius - The radius of the disk.
 * @param options - The options for the Poisson disk samples.
 * @returns The Poisson disk samples.
 */
export const getPoissonDiskSamples = (
  width: number,
  height: number,
  radius: number,
  options: PoissonDiskOptions,
): Row[] => {
  const K = options.K ?? 30 // Limit of samples to choose before rejection
  const CELL_SIZE = radius / Math.SQRT2

  const columns = Math.ceil(width / CELL_SIZE)
  const rows = Math.ceil(height / CELL_SIZE)

  const poissonDiskGrid: Row[] = new Array(columns).fill(null).map(() => new Array(rows).fill(-1))
  const active = []

  const pos = new Vector(Math.floor(Math.random() * width), Math.floor(Math.random() * height))
  const posCellX = Math.floor(pos.x / CELL_SIZE)
  const posCellY = Math.floor(pos.y / CELL_SIZE)

  if (poissonDiskGrid[posCellX] == null) throw new Error('Point out of bounds.')
  poissonDiskGrid[posCellX][posCellY] = pos
  active.push(pos)

  while (active.length > 0) {
    const randomIndex = Math.floor(Math.random() * active.length)
    const randomPoint = active[randomIndex] as Vector
    let isFound = false
    for (let i = 0; i < K; i++) {
      const sample = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)
      sample.setMagnitude(Math.random() * radius + radius)
      sample.add(randomPoint)

      const sampleCellX = Math.floor(sample.x / CELL_SIZE)
      const sampleCellY = Math.floor(sample.y / CELL_SIZE)
      if (sampleCellX < 0 || sampleCellX >= columns || sampleCellY < 0 || sampleCellY >= rows) {
        continue
      }

      if (poissonDiskGrid[sampleCellX] == null) throw new Error('Point out of bounds.')
      if (poissonDiskGrid[sampleCellX][sampleCellY] !== -1) {
        continue
      }

      let isNear = false
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          if (k === 0 && l === 0) {
            continue
          }
          const x = sampleCellX + k
          const y = sampleCellY + l
          if (x < 0 || x >= columns || y < 0 || y >= rows) {
            continue
          }

          if (poissonDiskGrid[x]?.[y] == null) throw new Error('Point out of bounds.')
          if (poissonDiskGrid[x][y] === -1) {
            continue
          }

          const sampleCell = poissonDiskGrid[x][y] as Vector

          // Check if within distance.
          const distanceVector = new Vector(sampleCell.x, sampleCell.y)
          distanceVector.subtract(sample)
          if (distanceVector.magnitude() < radius) {
            isNear = true
            break
          }
        }

        if (isNear) {
          break
        }
      }

      if (isNear) {
        continue
      }

      poissonDiskGrid[sampleCellX][sampleCellY] = sample
      active.push(sample)
      isFound = true
      break
    }

    if (!isFound) {
      active.splice(randomIndex, 1)
    }
  }

  return poissonDiskGrid
}
