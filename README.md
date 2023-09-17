This is a vite pluging for vue/React project.

With it you can add some post-css style class in template tag. like follow code:
``` <div class="w88"></div> ```

Then the plugin will generate the css class '.w88 { width: 88px }' in '/src/auto.css' automaticly. it will be loaded also automaticly.

# 1 How to use the pluging.

```//vite.config.ts
...
import {autoClassPlugin} from 'vite-plugin-vue-autoclass'

export default defineConfig({
  plugins: [vue(), autoClassPlugin({
    mainjsFile: 'main.ts'
  })],
  ...
)}
```

# 2 Config

You can use options param. the default options as bellow:

```
  const defaultOptions = {
    cssFile : 'auto.css', 
    mainUnit: 'px',
    mainjsFile: 'main.js', 
    refreshInit: true, // 当设为 true, dev启动时会手动刷新页面一次，以响应项目未启动时vue页面代码新增的css类
    classTypes: {
      w: {key: 'width', unit},  //unit 取值为传入的mainUnit
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
```

For example: class="mb20" => .mb20 { margin-bottom: 20px }
