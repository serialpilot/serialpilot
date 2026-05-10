import { join } from 'path'
import nodeGypBuild from 'node-gyp-build'

export const binding = nodeGypBuild(join(__dirname, '../')) as any
