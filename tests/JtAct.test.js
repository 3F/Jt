/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import test from 'ava';

import  { Jt, JtAct, JtConfig, JtIfHandler }  from '../dist/index'

test('public as(index: number): IJtAct;  min/max', t =>
{
    const jt = new Jt('%');

    let act = jt.use('name1', 'Hello %p%').as({ p: 'world'});
                
    t.is(act.value(), 'Hello world');

    act.as(-10);
    t.is(act.value(), 'Hello %p%');

    act.as(10);
    t.is(act.value(), 'Hello world');
});

test('public as(index: number): IJtAct;  0/1-indexes', t =>
{
    const jt = new Jt('%');

    let act = jt.use('', 'Hello %p%')
                    .as({ p: '%p% world'})
                    .as({ p: 'crazy'});

    t.is(act.as(0).value(), act.as(1).value());
    t.not(act.as(1).value(), act.as(2).value());

    t.is(act.as(1).value(), 'Hello %p%');
    t.is(act.as(2).value(), 'Hello %p% world');
    t.is(act.as(3).value(), 'Hello crazy world');
});

test('public as(index: number, offset?: number): IJtAct;', t =>
{
    const jt = new Jt({ op: '$' });

    let act = jt.use('name1', 'Hello $p1 $p2 $p3!')
                    .as({ p1: 'you' })
                    .as({ p2: 'Mr.' })
                    .as({ p3: 'Jt' });
                
    t.is(act.val(), 'Hello you Mr. Jt!');

    t.is(act.as(-1, true).value(), 'Hello you Mr. $p3!');
    t.is(act.as(-1, true).value(), 'Hello you $p2 $p3!');
    t.is(act.as(-1, true).value(), 'Hello $p1 $p2 $p3!');
    t.is(act.as(-1, true).value(), 'Hello $p1 $p2 $p3!');

    t.is(act.top().as(-1, true).value(), 'Hello you Mr. $p3!');
    t.is(act.top().as(-2, true).value(), 'Hello you $p2 $p3!');
    t.is(act.top().as(-3, true).value(), 'Hello $p1 $p2 $p3!');
    t.is(act.top().as(-4, true).value(), 'Hello $p1 $p2 $p3!');
    t.is(act.top().as(-100, true).value(), 'Hello $p1 $p2 $p3!');

    t.is(act.as(+1, true).value(), 'Hello you $p2 $p3!');
    t.is(act.as(+1, true).value(), 'Hello you Mr. $p3!');
    
    t.is(act.reset().value(), 'Hello $p1 $p2 $p3!');
    t.is(act.reset().as(+1, true).value(), 'Hello you $p2 $p3!');
    t.is(act.reset().as(+2, true).value(), 'Hello you Mr. $p3!');
    t.is(act.reset().as(+3, true).value(), 'Hello you Mr. Jt!');
    t.is(act.reset().as(+4, true).value(), 'Hello you Mr. Jt!');
    t.is(act.reset().as(+100, true).value(), 'Hello you Mr. Jt!');
    
    t.is(act.as(-1, true).value(), 'Hello you Mr. $p3!');

    t.is(act.as(0).value(), 'Hello $p1 $p2 $p3!');
    t.is(act.as(+1, true).value(), 'Hello you $p2 $p3!');
});

test('public as(values: IDictionary<vrel>): IJtAct', t =>
{
    const jt = new Jt('%');

    let act = jt.use('', 'Hello %p1% %p2%')
                    .as({ p1: 'amazing'})
                    .reset().as({ p2: 'world', p1: 'crazy'});

    t.is(act.value(), 'Hello crazy world');
    t.is(act.reset().as({}).value(), 'Hello %p1% %p2%');

    t.is(act.reset().as().value(), jt.use('').value());
    t.is(act.reset().as(undefined).value(), jt.use('').value());
    t.is(act.reset().as(null).value(), jt.use('').value());
});

test('public as(values: IDictionary<vrel>, pair: string): IJtAct', t =>
{
    const jt = new Jt('-');

    jt.use(8, 'Good %p%, {{p}} -p- !')
        .as({ p: 'Jt' })
        .as({ p: 'Mr.' }, '{{}}')
        .as({ p: 'morning' }, '%');
    
    t.is(jt.use(8).value(), 'Good morning, Mr. Jt !');
});

test('public as(values: IDictionary<vrel>, pair: string): IJtAct;  empty pair', t =>
{
    const jt = new Jt('-');

    jt.use('s1', 'Well -p-.').as({ p: 'done' }, undefined);
    t.is(jt.use('s1').value(), 'Well done.');

    let act = jt.use('s1').reset().as({ p: 'noted' }, null);
    t.is(act.value(), 'Well noted.');
});

test('public as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct', t =>
{
    const jt = new Jt('-');

    t.is
    (
        jt.use('s1', 'Good %p, $p -p- !')
            .as({ p: 'Jt' })
            .as({ p: 'Mr.' }, { op: '$' })
            .as({ p: 'morning' }, { op: '%' })
            .value(),
             
        'Good morning, Mr. Jt !'
    );
});

test('public as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct;  op/ed for non-instanceof JtConfig', t =>
{
    const jt = new Jt();

    const str = 'te$tte$t';

    t.is(jt.set('', str).as({ t: '8' }, { }).val(), str);
    t.is(jt.set('', str).as({ t: '8' }, { op: '$' }).val(), 'te8te8');
    t.is(jt.set('', str).as({ t: '8' }, { ed: '$' }).val(), str);
    t.is(jt.set('', str).as({ t: '8' }, { ed: '' }).val(), str);

    t.is(jt.set('', str).as({ t: '8' }, { op: '' }).val(), '8e$88e$8');
    t.is(jt.set('', str).as({ t: '8' }, { op: '', ed: '' }).val(), '8e$88e$8');
    t.is(jt.set('', str).as({ t: '8' }, { op: undefined }).val(), str);
    t.is(jt.set('', str).as({ t: '8' }, { op: null }).val(), str);
    
    t.is(jt.set('', str).as({ t: '8' }, { op: '$', ed: undefined }).val(), 'te8te8');
    t.is(jt.set('', str).as({ t: '8' }, { op: '$', ed: null }).val(), 'te8te8');
    t.is(jt.set('', str).as({ t: '8' }, { op: '$', ed: '' }).val(), 'te8te8');

    const str2 = 'te$t te$t';

    t.is(jt.set('', str2).as({ t: '8' }, { op: '$', ed: ' ' }).val(), 'te8te$t');
    t.is(jt.set('', str2).as({ t: '8' }, { op: '$', ed: '' }).val(), 'te8 te8');
    t.is(jt.set('', str2).as({ t: '8' }, { op: '$' }).val(), 'te8 te8');
});

test('public as(values: IDictionary<vrel>, cfg: IJtConfig): IJtAct;  final empty values', t =>
{
    const jt = new Jt('%');
    t.is(jt.set('', '%test%').as({ test: '' }).value(), '');
    t.is(jt.set('', ' %test%').as({ test: '' }).value(), ' ');

    t.is(jt.set('', '%test%').as({ test: 'test' }).value(), 'test');
    t.is(jt.set('', ' %test%').as({ test: 'test' }).value(), ' test');
});

test('constructor(jt: IJt, data: string | undefined = undefined);', t =>
{
    const act = new JtAct(new Jt(), 'data1');
    t.assert(act.jt());
    t.assert(act.jt() instanceof Jt);
    t.is(act.value(), 'data1');
});

test('constructor(jt: IJt, data: string | undefined = undefined);  empty data', t =>
{
    const act = new JtAct(new Jt(), undefined);
    t.is(act.value(), undefined);

    t.is(new JtAct(new Jt(), null).value(), null);
    t.is(new JtAct().value(), undefined);
});

test('public sa(handler: IJtHandler, data?: any, cfg?: IJtConfig[] | string[]): IJtAct', t =>
{
    const jt = new Jt('%');

    jt.use('', '%a% {( true )} %b% {;} %c%!')
        .sa(new JtIfHandler(['{}']))
        .as({ a: 'Hello', b: 'crazy', c: 'world'});
    
    t.is(jt.use('').val(), 'Hello  crazy  world!');

    jt.set('', '%a% {( true )} %b% {;} %c%!')
        .sa(undefined)
        .sa(null)
        .as({ a: 'Hello', b: 'crazy', c: 'world'});
    
    t.is(jt.use('').value(), null);
});

test('public sa(handler: IJtHandler, data?: any, cfg?: IJtConfig[] | string[]): IJtAct;  not IJtHandler', t =>
{
    const act = new Jt('%').set('', 'data');
    
    const error = t.throws(() => {
        act.sa({});
    });

    t.is(error.message.endsWith('.process is not a function'), true);
});

test('public sa(handler: IJtHandler, data?: any, cfg?: IJtConfig[] | string[]): IJtAct; custom configuration', t =>
{
    const jt    = new Jt('%');
    const jtif  = new JtIfHandler(['{}']);

    jt.use('', '{( true )} test {;}');
    
    t.is(jt.use('').sa(jtif, {}, [ ]).val(), ' test ');
    t.is(jt.use('').sa(jtif, {}, undefined).val(), ' test ');
    t.is(jt.use('').sa(jtif, {}, null).val(), ' test ');

    t.is(jt.use('hcfg', '[( true )] test [;]').sa(jtif).val(), '[( true )] test [;]');
    t.is(jt.use('hcfg').sa(jtif, {}, [ '[]' ]).val(), ' test ');

    t.is
    (
        jt.use('vcfg', '[( `d` > 5 )] yes [/] no [;]')
            .sa(jtif, { d: 7 }).val(),

        '[( `d` > 5 )] yes [/] no [;]'
    );

    t.is(jt.use('vcfg').sa(jtif, { d: 7 }, [ '[]', '`' ]).val(), ' yes ');
    t.is(jt.use('vcfg').as(-1, true).sa(jtif, { d: 7 }, [ '[]', '%' ]).val(), ' no ');
    t.is(jt.use('vcfg').as(-1, true).sa(jtif, { d: 5 }, [ '[]', '`' ]).val(), ' no ');

    t.is
    (
        jt.set('vcfg', '[( `d` > 5 )] yes [;]')
            .sa(jtif, { d: 4 }, [ '[]', '`' ]).val(),
        ''
    );

    t.is
    (
        jt.set('vcfg', '{( true )} yes {;}')
            .sa(jtif, { }).val(),
        ' yes '
    );
});

test('public clear(): IJtAct', t =>
{
    let act = new Jt('-')
                .use(1, 'Good %p, $p -p- !')
                        .as({ p: 'Jt' })
                        .as({ p: 'Mr.' }, { op: '$' })
                        .as({ p: 'morning' }, { op: '%' });

    t.is(act.as(3).as(4).value(), 'Good morning, Mr. Jt !');
    t.is(act.as(3).clear().as(4).value(), 'Good %p, Mr. Jt !');
});

test('public clear(): IJtAct; min/max ranges', t =>
{
    let act = new Jt('-')
                .use(1, 'Good %p, $p -p- !')
                        .as({ p: 'Jt' })
                        .as({ p: 'Mr.' }, { op: '$' })
                        .as({ p: 'morning' }, { op: '%' });

    t.is(act.as(10).clear().value(), 'Good morning, Mr. Jt !');
    t.is(act.as(4).clear().value(), 'Good morning, Mr. Jt !');

    act.as(0).clear();
    t.is(act.as(10).clear().value(), 'Good %p, $p -p- !');
});

test('public value(): any', t =>
{
    t.is(new Jt().use(1, 'data1').value(), 'data1');

    t.is(new JtAct(new Jt(), 'data1').value(), 'data1');
    t.is(new JtAct(new Jt(), ' ').value(), ' ');
    t.is(new JtAct(new Jt(), '').value(), '');
    t.is(new JtAct(new Jt(), undefined).value(), undefined);
    t.is(new JtAct(new Jt(), null).value(), null);
    t.is(new JtAct(new Jt(), 0).value(), 0);
    t.is(new JtAct(new Jt()).value(), undefined);
});

test('public val(): string', t =>
{
    t.is(new Jt().use(1, 'data1').val(), 'data1');

    t.is(new JtAct(new Jt(), 'data1').val(), 'data1');
    t.is(new JtAct(new Jt(), ' ').val(), ' ');
    t.is(new JtAct(new Jt(), '').val(), '');
    t.is(new JtAct(new Jt(), undefined).val(), '');
    t.is(new JtAct(new Jt(), null).val(), '');
    t.is(new JtAct(new Jt(), 0).val(), '');
    t.is(new JtAct(new Jt(), '0').val(), '0');
    t.is(new JtAct(new Jt()).val(), '');
});

test('public eject(cb: (v: any) => void): IJtAct', t =>
{
    let act = new Jt('-')
                .use('', 'Good %p, $p -p- !')
                        .as({ p: 'Jt' })
                        .eject((v) => t.is(v, 'Good %p, $p Jt !'))
                        .as({ p: 'Mr.' }, { op: '$' })
                        .eject((v) => t.is(v, 'Good %p, Mr. Jt !'))
                        .as({ p: 'morning' }, { op: '%' })
                        .eject((v) => t.is(v, 'Good morning, Mr. Jt !'));
                        
    t.is(act.value(), 'Good morning, Mr. Jt !');
    t.is(
        act.reset().eject((v) => t.is(v, 'Good %p, $p -p- !')).top().value(),
        'Good morning, Mr. Jt !'
    );
});

test('public reset(): IJtAct', t =>
{
    let act = new Jt('-')
                .use('', '$p -p- !')
                        .as({ p: 'Jt' })
                        .as({ p: 'Mr.' }, { op: '$' });
    
    t.is(act.val(), 'Mr. Jt !');
    t.is(act.reset().val(), '$p -p- !');
    t.is(act.as(2).reset().val(), '$p -p- !');
});

test('public top(): IJtAct', t =>
{
    let act = new Jt('-')
                .use('', '$p -p- !')
                        .as({ p: 'Jt' })
                        .as({ p: 'Mr.' }, { op: '$' });
    
    t.is(act.reset().top().val(), 'Mr. Jt !');
    t.is(act.as(2).top().val(), 'Mr. Jt !');
});

test('public bind(data: string, values?: IDictionary<vrel>, config?: IJtConfig): string', t =>
{
    let act = new JtAct(new Jt('`'));

    let str = 'Hello `p` $p';

    t.is(act.bind(str), str);
    t.is(act.bind(str, undefined), str);
    t.is(act.bind(str, null), str);
    
    t.is(act.bind(str, {}), str);
    t.is(act.bind(undefined, {}), undefined);
    t.is(act.bind(null, {}), null);
    t.is(act.bind('', {}), '');
    t.is(act.bind(str, { P: '8'}), str);

    t.is(act.bind(undefined, { p: 'Mr.'}), undefined);
    t.is(act.bind(null, { p: 'Mr.'}), null);
    t.is(act.bind('', { p: 'Mr.'}), '');

    t.is(act.bind(str, { p: 'Mr.'}), 'Hello Mr. $p');
    t.is(act.bind(str, { p: 'Mr.'}, { op: '$'}), 'Hello `p` Mr.');
    t.is(act.bind(str, { p: 'Mr.'}, {}), str);

    t.is(
        new JtAct(new Jt({ op: ''}))
            .bind('p1 p2 p3', { p1: 'Hello', p2: 'Mr.', p3: 'Jt'}),
        'Hello Mr. Jt'
    );
});

test('public bind(data: string, values?: IDictionary<vrel>, config?: IJtConfig): string;  zero numbers', t =>
{
    let act = new JtAct(new Jt('`'));

    let str = 'Hello `p` $p';

    t.is(act.bind(str, { p: 0}), 'Hello 0 $p');
    t.is(act.bind(str, { p: '0'}), 'Hello 0 $p');
    t.is(act.bind(str, { p: +0}), 'Hello 0 $p');
    t.is(act.bind(str, { p: -0}), 'Hello 0 $p');
    t.is(act.bind(str, { p: '+0'}), 'Hello +0 $p');
    t.is(act.bind(str, { p: '-0'}), 'Hello -0 $p');
    t.is(act.bind(str, { p: 1}), 'Hello 1 $p');
    t.is(act.bind(str, { p: +1}), 'Hello 1 $p');
    t.is(act.bind(str, { p: -1}), 'Hello -1 $p');
});

test('public bind(data: string, values?: IDictionary<vrel>, config?: IJtConfig): string;  null values', t =>
{
    let act = new JtAct(new Jt('`'));

    let str = 'Hello `p`';

    t.is(act.bind(str, { p: undefined}), 'Hello undefined');
    t.is(act.bind(str, { p: null}), 'Hello null');
    t.is(act.bind(str, { p: ''}), 'Hello ');
    t.is(act.bind(str, { p: 0}), 'Hello 0');
    t.is(act.bind(str, { p: false}), 'Hello false');
});