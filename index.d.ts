import { PluginOption } from 'vite'
const unit = 'px'
const defaultClassTypes = {
  w: {key: 'width', unit},
  h: {key: 'height', unit},
  lh: {key: 'line-height', unit},
  minh: {key: 'min-height', unit},
  minw: {key: 'min-width', unit},
  maxh: {key: 'max-height', unit},
  maxw: {key: 'max-width', unit},
  vw: {key: 'width', unit:'vw'},
  vh: {key: 'height', unit: 'vh'},
  pw: {key: 'width', unit: '%'},
  ph: {key: 'height', unit: '%'},
  p: {key: 'padding', unit},
  pl: {key: 'padding-left', unit},
  pr: {key: 'padding-right', unit},
  pt: {key: 'padding-top', unit},
  pb: {key: 'padding-bottom', unit},
  m: {key: 'margin', unit},
  ml: {key: 'margin-left', unit},
  mr: {key: 'margin-right', unit},
  mt: {key: 'margin-top', unit},
  mb: {key: 'margin-bottom', unit},
  fs: {key: 'font-size', unit},
  bdr:{key: 'border-radius', unit},
  bdrtl:{key: 'border-top-left-radius', unit},
  bdrtr:{key: 'border-top-right-radius', unit},
  bdrbl:{key: 'border-bottom-left-radius', unit},
  bdrbr:{key: 'border-bottom-right-radius', unit},
  op: {key: 'opacity', unit:'%'},
  z: {key: 'z-index', unit:''},
  fl: {key: 'flex', unit: ''},
  lft: {key: 'left', unit},
  rgt: {key: 'right', unit},
  top: {key: 'top', unit},
  btm: {key: 'bottom', unit}
} 
type classDescription = Partial<typeof defaultClassTypes> & Record<string, {key: string, unit: string}>
type optionType = {
  cssFile?: string,
  mainUnit?: string,
  mainjsFile?: string,
  classTypes?: classDescription | null
}
export function autoClassPlugin(option?: optionType): PluginOption