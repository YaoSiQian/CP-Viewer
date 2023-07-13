import { BlockData } from './BlockData'
import { Material } from './Material'
import { World } from './World'

export interface EditData {
  id: number
  time: number
  world: World | null
  x: number
  y: number
  z: number
  material: Material | null
  blockdata: BlockData[]
  action: number
  rollbacked: boolean
}

export interface CountInterface {
  place: number
  destroy: number
  rollbackPlace: number
  rollbackDestroy: number
  all: number
}

export interface EditDataResult {
  count: CountInterface
  data: EditData[]
}
