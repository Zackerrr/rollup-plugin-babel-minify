/*! rollup-plugin-babel-minify v4.0.0 | (c) 2018 Comandeer | MIT license (see LICENSE) */import MagicString from'magic-string';import semver from'semver';import depd from'depd';import minifyPreset from'babel-preset-minify';import bannerPlugin from'@comandeer/babel-plugin-banner';import{getCommentContent}from'@comandeer/babel-plugin-banner/utils';import{transform}from'babel-core';function addNewLine(a){const b=new MagicString(a),c=a.indexOf('*/');b.appendRight(c+2,'\n');const d=b.generateMap({includeContent:!0});return{code:b.toString(),map:d}}function filterMinifyOptions(a){const b=['banner','bannerNewLine','sourceMap','comments'],c={};return Object.keys(a).filter((d)=>{-1===b.indexOf(d)&&(c[d]=a[d])}),c}function isString(a){return null!=a&&'string'==typeof a}function isFn(a){return null!=a&&'function'==typeof a}function isFnOrString(a){return isString(a)||isFn(a)}function checkNodeVersion(){return semver.satisfies(process.version,'>=6.0.0')}const deprecate=depd('rollup-plugin-babel-minify');function minify(a={}){let b;return checkNodeVersion()||deprecate('This plugin will remove support for Node <6 in version 5.0.0.'),{name:'babel-minify',options({banner:a}){b=a},transformBundle(c,{banner:d}){const e=filterMinifyOptions(a),f={presets:[[minifyPreset,e]],sourceMaps:'undefined'==typeof a.sourceMap||!!a.sourceMap,comments:'undefined'==typeof a.comments||!!a.comments};if(isFnOrString(a.banner)||isFnOrString(d)||isFnOrString(b)){let c=a.banner||d||b;c=isFn(c)?c():c;const e=getCommentContent(c);let g=!1;f.plugins=[[bannerPlugin,{banner:c}]],f.comments||(f.shouldPrintComment=(a)=>g||a!==e?!1:(g=!0,!0))}let{code:g,map:h}=transform(c,f);return a.bannerNewLine&&({code:g,map:h}=addNewLine(g)),{code:g,map:h}}}}export default minify;
//# sourceMappingURL=rollup-plugin-babel-minify.es2015.js.map
