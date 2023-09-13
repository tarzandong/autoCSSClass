This is a vite pluging for vue project.

With it you can add some post-css style class in template tag. like follow code:
``` <div class="w88"></div> ```

Then the plugin will generate the css class '.w88 { width: 88px }' in '/src/auto.css' automaticly. it will be loaded also automaticly.

# 1 How to use the pluging.

```//vite.config.ts
...
import {autoClassPlugin} from 'vite-plugin-vue-autoclass'

export default defineConfig({
  plugins: [vue(), autoClassPlugin()],
  ...
)}
```

# 2 Config

Will offer the style key map config in recently future. Now you can use the default map as bellow:

```
  {
    w: {key: 'width'},
    h: {key: 'height'},
    lh: {key: 'line-height'},
    minh: {key: 'min-height'},
    minw: {key: 'min-width'},
    maxh: {key: 'max-height'},
    maxw: {key: 'max-width'},
    vw: {key: 'width', unit:'vw'},
    vh: {key: 'height', unit: 'vh'},
    pw: {key: 'width', unit: '%'},
    ph: {key: 'height', unit: '%'},
    p: {key: 'padding'},
    pl: {key: 'padding-left'},
    pr: {key: 'padding-right'},
    pt: {key: 'padding-top'},
    pb: {key: 'padding-bottom'},
    m: {key: 'margin'},
    ml: {key: 'margin-left'},
    mr: {key: 'margin-right'},
    mt: {key: 'margin-top'},
    mb: {key: 'margin-bottom'},
    fs: {key: 'font-size'},
    bdr:{key: 'border-radius'},
    bdrtl:{key: 'border-top-left-radius'},
    bdrtr:{key: 'border-top-right-radius'},
    bdrbl:{key: 'border-bottom-left-radius'},
    bdrbr:{key: 'border-bottom-right-radius'},
    op: {key: 'opacity', unit:'%'},
    z: {key: 'z-index', unit:''},
    fl: {key: 'flex':, unit ''}
  }
```

For example: class="mb20" => .mb20 { margin-bottom: 20px }
