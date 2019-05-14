/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import { src, dest, series, parallel } from 'gulp';
import { cfg, dsrc } from './config';

import gap from 'gulp-append-prepend';
import getRepoInfo from 'git-repo-info';
import { version } from '../package.json';
import replace from 'gulp-replace';
import zip from 'gulp-zip';

exports.distr = series(
    header,
    parallel
    (
        distributeJS, distributeMap, distributeMeta, distributeIndexjs
    ),
    pack
);

const gitInfo = getRepoInfo();

function header()
{
    return src('header')
    .pipe(replace('$version$', version + '+' + gitInfo.abbreviatedSha))
    .pipe(replace('$core$', '^'))
    .pipe(replace('$handler$', '^'))
    .pipe(replace('$es$', '^'))
    .pipe(replace('$safe$', '^'))
    .pipe(dest(cfg.dir.obj, { overwrite: true }));
}

function distributeJS()
{
    return src([
        cfg.dir.obj + '**/*.js',
    ])
    .pipe(gap.prependFile(cfg.dir.obj + 'header', ''))
    .pipe(dest(cfg.dir.out, { overwrite: true }));
}

function distributeMap()
{
    return src([
        cfg.dir.obj + '**/*.map',
    ])
    .pipe(dest(cfg.dir.out, { overwrite: true }));
}

function distributeMeta()
{
    return src([
        './License.txt',
        './changelog.txt',
        './package.json',
        './Readme.md',
    ])
    .pipe(dest(cfg.dir.out, { overwrite: true }));
}

function distributeIndexjs()
{
    return src([
        './index.js',
    ])
    .pipe(gap.prependFile(cfg.dir.obj + 'header', ''))
    .pipe(dest(cfg.dir.out, { overwrite: true }));
}

function pack()
{
    return src([
        cfg.dir.out + '**/*',
    ])
    .pipe(zip(`Jt-_-${version}+${gitInfo.abbreviatedSha}.zip`))
    .pipe(dest(cfg.dir.zipped, { overwrite: true }));
}