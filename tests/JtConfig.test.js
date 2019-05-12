/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import test from 'ava';

import  { JtConfig }  from '../dist/index'

test('JtConfig.tag(string)', t =>
{
    t.is(new JtConfig('{}').tag('name'), '{name}');

    t.is(JtConfig.make({ op: '$' }).tag('name'), '$name');
    t.is(JtConfig.make({ op: '$', ed: '$' }).tag('name'), '$name$');
    t.is(JtConfig.make({ ed: '$' }).tag('name'), 'undefinedname$');
});

test('JtConfig.tag(string); empty op & ed', t =>
{
    let exp = 'name';

    t.is(new JtConfig(null).tag(exp), `undefined${exp}undefined`);

    t.is(JtConfig.make({}).tag(exp), `undefined${exp}`);
    t.is(JtConfig.make({ op: undefined, ed: undefined }).tag(exp), `undefined${exp}`);
    t.is(JtConfig.make({ op: null, ed: null }).tag(exp), `null${exp}`);
});

test('JtConfig.tag(string); name and space', t =>
{
    let cfg = new JtConfig('%');
    t.is(cfg.tag(' name and space '), '% name and space %');

    t.is(JtConfig.make({ op: '$' }).tag(' op and ed '), '$ op and ed ');
});

test('JtConfig.pair(string)', t =>
{
    let cfg = new JtConfig('%');

    cfg.pair('#');
    t.is(cfg.op, '#');
    t.is(cfg.ed, '#');

    cfg.pair('%%');
    t.is(cfg.op, '%');
    t.is(cfg.ed, '%');

    cfg.pair('{}');
    t.is(cfg.op, '{');
    t.is(cfg.ed, '}');

    cfg.pair('{{}}');
    t.is(cfg.op, '{{');
    t.is(cfg.ed, '}}');

    cfg.pair('{{}');
    t.is(cfg.op, '{{');
    t.is(cfg.ed, '}');

    t.is('{{', cfg.op);
    t.is(cfg.ed, '}');
});

test('JtConfig.pair();', t =>
{
    let cfg = new JtConfig('%');

    cfg.pair('#');
    t.is(cfg.op, '#');
    t.is(cfg.ed, '#');

    cfg.pair('');

    t.is(cfg.op, '#');
    t.is(cfg.ed, '#');
});

test('JtConfig.make(string)', t =>
{
    let cfg1 = JtConfig.make('{}');
    let cfg2 = new JtConfig('{}');

    t.is(cfg1.op, cfg2.op);
    t.is(cfg1.ed, cfg2.ed);
});

test('JtConfig.make()', t =>
{
    let cfg1 = JtConfig.make();
    let cfg2 = new JtConfig();

    t.is(cfg1.op, cfg2.op);
    t.is(cfg1.ed, cfg2.ed);
});

test('JtConfig.make(IJtConfig)', t =>
{
    let cfg1 = new JtConfig('{}');
    let cfg2 = JtConfig.make(cfg1);

    t.is(cfg1.op, cfg2.op);
    t.is(cfg1.ed, cfg2.ed);
});

test('JtConfig.make(IJtConfig); not instanceof JtConfig', t =>
{
    let cfg = JtConfig.make({ });
    t.is(cfg.hasOwnProperty('op'), true);
    t.is(cfg.hasOwnProperty('ed'), true);
    t.is(cfg.op, undefined);
    t.is(cfg.ed, '');

    cfg = JtConfig.make({ op: '$' });
    t.assert(cfg instanceof JtConfig);

    t.is(cfg.op, '$');
    t.is(cfg.ed, '');

    cfg = JtConfig.make({ ed: '^' });
    t.is(cfg.op, undefined);
    t.is(cfg.ed, '^');
});

test('JtConfig.constructor(string)', t =>
{
    let cfg1 = new JtConfig('[]');
    let cfg2 = {op: '[', ed: ']'}

    t.is(cfg1.op, cfg2.op);
    t.is(cfg1.ed, cfg2.ed);
});

test('JtConfig.constructor()', t =>
{
    let cfg = new JtConfig();

    t.assert(cfg.op);
    t.assert(cfg.ed);

    cfg = new JtConfig(undefined);

    t.assert(cfg.op);
    t.assert(cfg.ed);

    cfg = new JtConfig('');

    t.falsy(cfg.op);
    t.falsy(cfg.ed);

    cfg = new JtConfig(null);

    t.falsy(cfg.op);
    t.falsy(cfg.ed);

    cfg = new JtConfig(' ');

    t.is(cfg.op, ' ');
    t.is(cfg.ed, ' ');
});