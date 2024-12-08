
import fs from 'fs'

export function autoClassPlugin(options = {cssFile : '', mainUnit: '', mainjsFile:'', classTypes:null}){
  let {cssFile, mainUnit, classTypes, mainjsFile} = options
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
      emw: {key: 'width', unit: 'em'},
      remw: {key: 'width', unit: 'rem'},
      emh: {key: 'height', unit: 'em'},
      remh: {key: 'height', unit:'rem'},
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
      btm: {key: 'bottom', unit},
      gap: {key: 'gap', unit},
      bc: {key: 'background-color', unit: ''}, //颜色类用'-'分割，因为颜色值是十六位编码，无法用数字类型去判断
      tc: {key: 'color', unit: ''},
      ta: {key: 'text-align', unit: ['left', 'center', 'right']},
      ai: {key: 'align-items', unit: ['start', 'center', 'end']},
      jc: {key: 'justify-content', unit: ['start', 'center', 'end', 'space-between', 'space-arround']},
      dp: {key: 'display', unit: ['flex', 'block', 'none']},
      fxd: {key: 'flex-direction', unit: ['row', 'column']},
      fxw: {key: 'flex-wrap', unit: ['wrap', 'no-wrap']}
    }
  }
  if (!cssFile) cssFile = defaultOptions.cssFile
  if (!classTypes) classTypes = defaultOptions.classTypes 
  else {
    for (let key in defaultOptions.classTypes) {
      if (!classTypes[key]) {
        classTypes[key] = defaultOptions.classTypes[key]
      }
    }
  }
  if (!mainjsFile) mainjsFile = defaultOptions.mainjsFile

  let config
  let autoClassContent = ''
  let allClassName = []
  let autoCSSFile
  let init = true
  return {
    //插件名字
    name:'vite-plugin-autoClass',
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transformIndexHtml(html) {
      if (config.env.PROD) {
        //生产环境引入 auto.css的方法
        return html.replace('</head', `\t<link rel="stylesheet" href="/${config.build.assetsDir}/${cssFile}">\n\t</head`)
      }
      else return html
    },
    transform(code,id){
      // console.log(id)
      if (id.substring(id.length - mainjsFile.length) == mainjsFile) {
        if (!autoCSSFile) {
          const tempPath = id.substring(0, id.length - mainjsFile.length)
          autoCSSFile = tempPath + (cssFile? cssFile : 'auto.css')
          if (fs.existsSync(autoCSSFile)) fs.unlinkSync(autoCSSFile)
          fs.writeFileSync(autoCSSFile,`/*auto generated, do not edit*/
        `)  
        }
      
        //由于auto.css为自动生成，每个项目成员开发者都有可能生成新的不同的css类，容易产生代码冲突，所以在gitignore中将其屏蔽
        if (fs.existsSync('./.gitignore')) {
          let ignoreContent = fs.readFileSync('./.gitignore', 'utf-8')
          if (!ignoreContent.includes(cssFile)) {
            ignoreContent = cssFile+'\n'+ignoreContent
          }
          fs.writeFileSync('./.gitignore',ignoreContent) 
        }
        
        
        if (config.env.DEV) {
          //开发环境引入 auto.css的方法是在main.js中，以便于hrm
          code = `import './${cssFile? cssFile : 'auto.css'}'
          ${code}
          if (window) {
            window.addEventListener("load", function () {
              console.log('loaded')
              let xhr = new XMLHttpRequest()
              xhr.open('GET', '/refresh')
              xhr.send()
            })
          }
          `
        }
        
      }
      else if (['.vue', '.jsx', '.tsx'].includes(id.substring(id.length-4))) {
        if (!autoCSSFile) return code
        autoClassContent = fs.readFileSync(autoCSSFile)
        const templateStr = id.substring(id.length-4) == '.vue' ? code.substring(code.indexOf('<template>'), code.lastIndexOf('</template>')) : code
        const classStr1 = id.substring(id.length-4) == '.vue' ? (templateStr.match(/class=".*?"/g) ?? []) : (templateStr.match(/className=".*?"/g) ?? [])
        const classStr2 = id.substring(id.length-4) == '.vue' ? (templateStr.match(/class='.*?'/g) ?? []) : (templateStr.match(/className='.*?'/g) ?? [])
        
        let classArr = classStr1.concat(classStr2).reduce((pre,cur)=>{
          return pre.concat(cur.split(/[ '"{:]/).filter(item=>{
            return /\d+$/.test(item) || item.includes('-')
          }))
        }, [])
        const autoClasss = [...(new Set(classArr))]
        const contentStr = autoClasss.reduce((pre, cur)=>{
          const isColor = cur.includes('-')
          const label = isColor ? cur.split('-')[0] : cur.replaceAll(/\d+/g, '')
          if (classTypes[label] && !allClassName.includes(`.${cur}`)) allClassName.push(`.${cur}`)
          const n = isColor ? cur.split('-')[1] : Number(cur.replaceAll(/\D+/g, '')) //获取数值
          if ( !classTypes[label] || autoClassContent.includes(cur) || (!isColor && isNaN(Number(n))) ) return pre
          let c = 
`.${cur} {
  ${ classTypes[label].key }: ${ isColor ?  '#' + n
  :  typeof classTypes[label].unit === 'object' ? (classTypes[label].unit[n] ?? classTypes[label].unit[0])
  : cur.replaceAll(/\D+/g, '') + classTypes[label].unit }
}`
   if(isColor)       console.log(c)
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
          
          server.moduleGraph.urlToModuleMap.forEach((value, key)=>{
            if (key.includes(cssFile))
            server.reloadModule(value)
          })
        }
        next()
      })
    },
    closeBundle() {
      if (config.env.PROD) {
        //生产环境打包时将auto.css拷贝至输出文件夹的assets中
        fs.copyFileSync(autoCSSFile, `./${config.build.outDir}/${config.build.assetsDir}/${cssFile}`)
      }
    }
  }
}