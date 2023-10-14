This is a vite pluging for vue/React project.

With it you can add some post-css style class in template tag. like follow code:
``` <div class="w88"></div> ```

Then the plugin will generate the css class '.w88 { width: 88px }' in '/src/auto.css' automaticly. it will be loaded also automaticly.

# 1 How to use the pluging.

```
//vite.config.ts
...
import {autoClassPlugin} from 'vite-plugin-vue-autoclass'

export default defineConfig({
  plugins: [
    vue(), 
    autoClassPlugin({
      mainjsFile: 'main.ts',
      cssFile: ...,
      mainUnit: ...
    })
  ],
  ...
)}
```
```
//foo.vue
...
<template>
  <div class="mb20">I'm a margin-bottom 20px div</div>
</template>
...
```

# 2 Config

You can use options param, the classType option haven't open by now. Ofcause you can use it without any param like 'plugins: [vue(), **autoClassPlugin()**]', then the plugin will use default options as bellow:

```
  const defaultOptions = {
    cssFile : 'auto.css',  //the generate css file name, the path will be '/src'
    mainUnit: 'px',
    mainjsFile: 'main.js', //the Vue/React entry file name
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
      mb: {key: 'margin-bottom', unit}, //example
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
  }
```

For example: class="mb20" => .mb20 { margin-bottom: 20px }. you can check the classType option and will find **mb** means the css property **margin-bottom**.


# 3 Notice

1. For match correct class/classname, please make sure the correct spell in '.vue/.jsx' for these words bellow:
**<template\>**, **</template\>**, **class=**, **className=**
If those words have any empty space ' ' inserted in, will miss-match some css class.

2. Please make sure there hasn't another file which name is same with ***mainjsFile*** in your project. 
