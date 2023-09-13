
import fs from 'fs'

export function autoClassPlugin(cssFile = 'auto.css', unit='px'){
  let config
  let autoClassContent = ''
  let autoCSSFile
  const cTypes = {
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
    fl: {key: 'flex', unit: ''}
  }
  return {
    //插件名字
    name:'vite-plugin-vue-autoClass',
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      autoCSSFile = config.root + '/src/' + (cssFile? cssFile : 'auto.css')
      if (!fs.existsSync(autoCSSFile)) fs.writeFileSync(autoCSSFile,'')
    },
    
    transform(code,id){
      // console.log(id)
      autoClassContent = fs.readFileSync(autoCSSFile)
      if (id.substring(id.length-4) == '.vue') {
        const classArr = code.substring(code.indexOf('<template>'), code.indexOf('</template>')).split(/[ '"]/).filter(item=>{
          return /\d+$/.test(item)
        })
        const autoClasss = [...(new Set(classArr))]
        // console.log(autoClasss)
        const contentStr = autoClasss.reduce((pre, cur)=>{
          // console.log(cur)
          const label = cur.replaceAll(/\d+/g, '')
          // console.log(label, cTypes[label])
          if ( !cTypes[label] || autoClassContent.includes(cur) ) return pre
          let c = `.${cur} {
            ${cTypes[label].key}: ${cur.replaceAll(/\D+/g, '')}${cTypes[label].unit}
          }`
          return pre+`
          ${c}`
        }, '')
        autoClassContent += contentStr
        if (contentStr) {
          fs.writeFileSync(autoCSSFile, autoClassContent)
        }

        //写入单个vue组件文件中，此方法造成代码冗余，放弃
        // code = code.replace('</style>', contentStr + '' + hStr + '  </style>')
      }
      else if (id.substring(id.length - 7) == 'main.ts' || id.substring(id.length - 7) == 'main.js') {
        console.log(id)
        code = `import './${cssFile? cssFile : 'auto.css'}'
        ${code}
        `
      }
      return code;
    },
  }
}