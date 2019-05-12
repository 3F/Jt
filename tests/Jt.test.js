/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import test from 'ava';

import  { Jt, JtConfig, JtIfHandler, JtAct  }  from '../dist/index'

test('use(name: string): IJtAct;', t =>
{
    const act = (new Jt()).use('name1');

    t.assert(act);
    t.is(act.value(), undefined);
});

test('use(name: string): IJtAct; Allocating and accessing', t =>
{
    const jt = new Jt('%');

    let act = jt.use('name1', 'data1');
    t.assert(act);
    t.is(act.value(), 'data1');
    
    act = jt.use('name1');
    t.is(act.value(), 'data1');

    act = jt.nil('name1').use('name1');
    t.is(act.value(), undefined);
});

test('public use(name: string, data: string | undefined): IJtAct', t =>
{
    const jt = new Jt('%');

    let act = jt.use('name1', 'data1');
    t.assert(act);
    t.is(act.value(), 'data1');

    t.is(jt.use('name1', 'new data2').value(), 'data1');

    t.is(jt.use('name1', undefined).value(), 'data1');
    t.is(jt.use('name1', null).value(), 'data1');
});

test('public use(name: string, data: string | undefined): IJtAct;  empty init', t =>
{
    let act = new Jt().use('');
    t.assert(act);
    t.is(act.value(), undefined);

    const jt = new Jt();

    act = jt.use();
    t.assert(act);
    t.is(act.value(), undefined);

    t.is(jt.use('name1', 'data1').value(), 'data1');
    t.is(jt.use(undefined).value(), undefined);
    t.is(jt.use(null).value(), undefined);
    t.is(jt.use('name1').value(), 'data1');
});

test('public use(name: string[]): IDictionary<IJtAct>;', t =>
{
    const jt = new Jt('%');

    let act = jt.use([ ]);
    t.assert(act);

    act = jt.use(['name1', 'name2']);

    t.assert(act.name1);
    t.assert(act.name2);

    t.is(act.name1.value(), undefined);
    t.is(act.name2.value(), undefined);
});

test('public use(name: string[]): IDictionary<IJtAct>; Allocating and accessing', t =>
{
    const jt = new Jt('%');

    jt.use('name1', 'data1');
    jt.use('name2', 'data2');
    
    const act = jt.use(['name1', 'name3', 'name2']);
    t.assert(act);

    t.assert(act.name1);
    t.assert(act.name2);
    t.assert(act.name3);

    t.is(act.name1.value(), 'data1');
    t.is(act.name3.value(), undefined);
    t.is(act.name2.value(), 'data2');
});

test('public use(data: IDictionary<string>[]): IDictionary<IJtAct>;', t =>
{
    const jt = new Jt('%');

    let act = jt.use([{ }]);
    t.assert(act);

    act = jt.use([{ 'name1': 'data1' }, { 'name3': undefined }, { 'name2': 'data2' }]);
    t.assert(act);

    t.assert(act.name3);

    t.is(act.name1.value(), 'data1');
    t.is(act.name3.value(), undefined);
    t.is(act.name2.value(), 'data2');
});

test('public use(name: string, data: string | undefined): IJtAct;  null -> undefined', t =>
{
    const jt = new Jt();

    t.is(jt.use('name1', undefined).value(), undefined);
    t.is(jt.use('name2', null).value(), null);
    
    t.is(jt.use('name1', 'data1').value(), undefined);
    t.is(jt.use('name2', 'data2').value(), null);
});

test('public set(name: string, data: string | undefined): IJtAct', t =>
{
    const jt = new Jt('%');
    
    const act = jt.set('name1', 'data1');
    t.assert(act);
    t.is(act.value(), 'data1');

    t.is(jt.set('name1', 'new data2').value(), 'new data2');

    t.is(jt.set('name1', undefined).value(), undefined);
    t.is(jt.set('name1', null).value(), null);

    t.is(jt.set('name2').value(), undefined);
    t.is(jt.set('name1', 'new data1').value(), 'new data1');
});

test('public set(name: string, data: string | undefined): IJtAct;  empty init', t =>
{
    const jt = new Jt('%');

    let act = jt.set('');
    t.assert(act);
    t.is(act.value(), undefined);

    act = jt.set();
    t.assert(act);
    t.is(act.value(), undefined);

    t.is(jt.set('name1', 'data1').value(), 'data1');
    t.is(jt.set(undefined).value(), undefined);
    t.is(jt.set(null).value(), undefined);
    t.is(jt.use('name1').value(), 'data1');
});

test('constructor();', t =>
{
    const jt = new Jt();
    t.assert(jt.config);
    t.assert(jt.config instanceof JtConfig);
});

test('constructor(pair: string);', t =>
{
    let jt = new Jt('{}');
    t.is(jt.config.op, '{');
    t.is(jt.config.ed, '}');

    jt = new Jt('%');
    t.is(jt.config.op, '%');
    t.is(jt.config.ed, '%');
});

test('constructor(config: IJtConfig);', t =>
{
    const cfg = new JtConfig('{}');

    const jt = new Jt(cfg);
    t.is(jt.config.op, '{');
    t.is(jt.config.ed, '}');

    cfg.pair('%');
    t.is(jt.config.op, '%');
    t.is(jt.config.ed, '%');
});

test('public nil(...names: string[]): IJt', t =>
{
    const jt = new Jt();

    jt.use([ {'name1': 'data1'}, {'name2': 'data2'}, {'name3': 'data3'}, ]);
    jt.nil('name1', 'name3');

    t.is(jt.use('name1').value(), undefined);
    t.is(jt.use('name2').value(), 'data2');
    t.is(jt.use('name3').value(), undefined);
});

test('public nil(...names: string[]): IJt; empty init', t =>
{
    const jt = new Jt();

    jt.use([ {'name1': 'data1'}, {'name2': 'data2'}, {'name3': 'data3'}, ]);
    jt.nil();

    t.is(jt.use('name1').value(), 'data1');
    t.is(jt.use('name2').value(), 'data2');

    jt.nil(undefined, 'name2');
    jt.nil(null, 'name2');

    jt.nil('name1', undefined);
    jt.nil('name1', null);

    t.is(jt.use('name1').value(), undefined);
    t.is(jt.use('name2').value(), undefined);
    t.is(jt.use('name3').value(), 'data3');
});

test('public nil(...names: string[]): IJt;  null & undefined', t =>
{
    const jt = new Jt();

    jt.use(undefined, 'data 1');
    jt.use(null, 'data 2');
    jt.use('', 'data 3');

    t.is(jt.use(undefined).value(), 'data 1');
    t.is(jt.use(null).value(), 'data 2');
    t.is(jt.use('').value(), 'data 3');

    jt.nil(null);

    t.is(jt.use(undefined).value(), 'data 1');
    t.is(jt.use(null).value(), undefined);
    t.is(jt.use('').value(), 'data 3');

    jt.nil(undefined);

    t.is(jt.use(undefined).value(), undefined);
    t.is(jt.use(null).value(), undefined);
    t.is(jt.use('').value(), 'data 3');

    jt.nil('');

    t.is(jt.use(undefined).value(), undefined);
    t.is(jt.use(null).value(), undefined);
    t.is(jt.use('').value(), undefined);
});

test('public is(name: string): IJtAct | null', t =>
{
    const jt = new Jt();

    jt.use([ {'name1': 'data1'}, {'name2': 'data2'} ])
    jt.use(undefined, 'data 3');
    jt.use(null, 'data 4');
    jt.use('', 'data 5');

    t.not(jt.is('name1'), null);
    t.not(jt.is('name2'), null);
    t.not(jt.is(undefined), null);
    t.not(jt.is(null), null);
    t.not(jt.is(''), null);

    jt.nil('name2');

    t.assert(jt.is('name1') instanceof JtAct);
    t.is(jt.is('name2'), null);
    t.assert(jt.is(undefined) instanceof JtAct);
    t.assert(jt.is(null) instanceof JtAct);
    t.assert(jt.is('') instanceof JtAct);

    jt.nil(undefined, '', null);

    t.assert(jt.is('name1') instanceof JtAct);
    t.is(jt.is('name2'), null);
    t.is(jt.is(undefined), null);
    t.is(jt.is(null), null);
    t.is(jt.is(''), null);

    jt.nil('name1');
    t.is(jt.is('name1'), null);
});