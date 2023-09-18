
import fs from 'fs'

export function autoClassPlugin(options = {cssFile : '', mainUnit: '', mainjsFile:''}){
  let {cssFile, mainUnit, classTypes, mainjsFile, refreshInit} = options
  const unit = mainUnit? mainUnit : 'px'
  const defaultOptions = {
    cssFile : 'auto.css', mainUnit: 'px',
    mainjsFile: 'main.js', 
    classTypes: {
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
  }
  if (!cssFile) cssFile = defaultOptions.cssFile
  if (!classTypes) classTypes = defaultOptions.classTypes 
  if (!mainjsFile) mainjsFile = defaultOptions.mainjsFile

  // let config
  let autoClassContent = ''
  let autoCSSFile
  let init = true
  return {
    //插件名字
    name:'vite-plugin-autoClass',
    enforce: "pre",
    // configResolved(resolvedConfig) {
    //   config = resolvedConfig;
    //   console.log(config.build)
    //   autoCSSFile = config.root + '/src/' + (cssFile? cssFile : 'auto.css')
    // },
    
    transform(code,id){
      // console.log(id)
      if (id.substring(id.length - mainjsFile.length) == mainjsFile) {
        if (!autoCSSFile) {
          const tempPath = id.substring(0, id.length - mainjsFile.length)
          autoCSSFile = tempPath + (cssFile? cssFile : 'auto.css')
          if (!fs.existsSync(autoCSSFile)) fs.writeFileSync(autoCSSFile,'')  
        }

        code = `import './${cssFile? cssFile : 'auto.css'}'
        ${code}
        window.addEventListener("load", function () {
          console.log('loaded')
          let xhr = new XMLHttpRequest()
          xhr.open('GET', '/refresh')
          xhr.send()
        })
        if (import.meta.hot) {
          import.meta.hot.on('refresh', ()=>{
            console.log('refresh')
            window.location.reload()
          })
        }
        `
      }
      else if (['.vue', '.jsx', '.tsx'].includes(id.substring(id.length-4))) {
        if (!autoCSSFile) return code
        autoClassContent = fs.readFileSync(autoCSSFile)
        const templateStr = id.substring(id.length-4) == '.vue' ? code.substring(code.indexOf('<template>'), code.indexOf('</template>')) : code.substring(code.indexOf('return'))
        const classStr1 = id.substring(id.length-4) == '.vue' ? (templateStr.match(/class=".*?"/g) ?? []) : (templateStr.match(/className=".*?"/g) ?? [])
        const classStr2 = id.substring(id.length-4) == '.vue' ? (templateStr.match(/class='.*?'/g) ?? []) : (templateStr.match(/className='.*?'/g) ?? [])
        let classArr = classStr1.concat(classStr2).reduce((pre,cur)=>{
          return pre.concat(cur.split(/[ '"]/).filter(item=>{
            return /\d+$/.test(item)
          }))
        }, [])
        
        const autoClasss = [...(new Set(classArr))]
        const contentStr = autoClasss.reduce((pre, cur)=>{
          const label = cur.replaceAll(/\d+/g, '')
          if ( !classTypes[label] || autoClassContent.includes(cur) ) return pre
          let c = `.${cur} {
            ${classTypes[label].key}: ${cur.replaceAll(/\D+/g, '')}${classTypes[label].unit}
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
      
      return code;
    },
    configureServer(server) {
      // 姿势 1: 在 Vite 内置中间件之前执行
      server.middlewares.use((req, res, next) => {
        // console.log(req.url)        
        if (req.url=='/refresh' && init) {
          init = false
          server.ws.send({
            type: 'custom',
            event: 'refresh'
          })
        }
        next()
      })
    }
  }
}