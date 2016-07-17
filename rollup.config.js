// rollup.config.js

export default {
  entry: 'lib/cssobj-helper.js',
  moduleName: 'cssobj_helper',
  moduleId: 'cssobj_helper',
  targets: [
    { format: 'iife', dest: 'dist/cssobj-helper.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj-helper.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj-helper.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj-helper.es.js'   }
  ]
}
