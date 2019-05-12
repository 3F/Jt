/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc } from './config';
import { eumdNative, removeComments } from './umd'
import { esname, libEdition, nccEdition } from './suffixes';

import browserify from 'browserify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import closureCompiler from 'google-closure-compiler';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import gap from 'gulp-append-prepend';
import replace from 'gulp-replace';

exports.Jt = parallel(
    JtBuildES3, JtBuildES6, JtBuildProtectedES3, JtBuildProtectedES6,
    JtBuildNodeES6,
    // JtBuildNodeProtectedES6
);

function JtBuildES6()
{
    return build(eumdNative, 'ES6', 'ECMASCRIPT_2015');
}

function JtBuildProtectedES6()
{
    return build(eumdNative, 'ES6', 'ECMASCRIPT_2015', cfg.src.protected);
}

function JtBuildES3()
{
    // TSC ES6 -> CC ES3 will safe about 132 bytes for current Jt than initial TSC ES3
    return build(eumdNative, 'ES6', 'ECMASCRIPT3');
}

function JtBuildProtectedES3()
{
    // TSC ES6 -> CC ES3 will safe about 198 bytes for current Jt than initial TSC ES3
    return build(eumdNative, 'ES6', 'ECMASCRIPT3', cfg.src.protected);
}

function JtBuildNodeES6()
{
    return build(eumdNative, 'ES6', 'ECMASCRIPT_2015', '', false);
}

function JtBuildNodeProtectedES6()
{
    return build(eumdNative, 'ES6', 'ECMASCRIPT_2015', cfg.src.protected, false);
}

function useBrowserify(input, tsTarget, edition)
{
    return browserify({
        // basedir: cfg.dir.src,
        debug: cfg.isDebug(),
        // entries: [ cfg.src.Jt + edition + '.ts' ],
        entries: input,
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { "target": tsTarget })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif(cfg.isDebug(), sourcemaps.init({ loadMaps: true })));
}

function build(func, tsTarget, ccTarget, edition = '', compile = true)
{
    const cc = closureCompiler.gulp();

    const es    = esname(ccTarget);
    const libe  = libEdition(edition);
    const ncc   = nccEdition(!compile);

    let inf = '/*[core lib] '+ es +'+';
    if(libe) {
        inf += ' ' + libe +' edition';
    }
    if(ncc) {
        inf += ' [NCC]'
    }
    inf += '*/';

    let stream = func([dsrc(cfg.src.Jt) + edition + '.ts'], tsTarget, edition)
    .pipe(gulpif(compile, cc({
        ...cfg.closure.def, 
        language_out: ccTarget,
        externs: dsrc(cfg.src.Jt) + cfg.src.externs + '.js',
        chunk: [],
    })))

    removeComments(stream, compile)
    .pipe(gap.prependText(inf))
    .pipe(rename({ basename: `${cfg.src.Jt}.${es.toLowerCase()}${libe}${ncc}`}))
    .pipe(gulpif(cfg.isDebug(), sourcemaps.write('./')))
    .pipe(dest(cfg.dir.obj, { overwrite: true }));

    return stream;
}