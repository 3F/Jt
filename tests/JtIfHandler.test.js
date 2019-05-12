/**
 * Copyright (c) 2019 Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 */

import test from 'ava';

import  { Jt, JtAct, JtIfHandler }  from '../dist/index'

test('JtIfHandler.process()', t =>
{
    const jt    = new Jt('%');
    const jtif  = new JtIfHandler([ '{}', { op: '$' } ],
    {
        if: '',
        else: '/',
        elif: '/',
        fi: ';',
    });

    jt.use('', '{( $d > 5 )}yes{/}no{;}');
    
    t.is(jt.use('').sa(jtif, { d: 5 }).val(), 'no');
    t.is(jt.use('').reset().sa(jtif, { d: 6 }).val(), 'yes');

    jt.set('', '{( $d > -5 )}yes{/}no{;}');

    t.is(jt.use('').reset().sa(jtif, { d: 0 }).val(), 'yes');
    t.is(jt.use('').reset().sa(jtif, { d: '0' }).val(), 'yes');
});

test('JtIfHandler.process(); IJtIfOperator', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', '`' ],
    {
        if: 'if',
        else: 'else',
        fi: 'endif',
    });
    
    t.is
    (
        jt.set('', '{if( true )}yes{else}no{endif}')
            .sa(jtif).val(), 
        'yes'
    );

});

test('JtIfHandler.process(); vcfg', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', ' ' ],
    {
        if: '',
        else: '/',
        fi: ';',
    });
    
    t.is
    (
        jt.set('', '{if( "`val`" == "test of val !" )}yes{/}no{;}')
            .sa(jtif, { val: 'test of val !'}, [ '{}', '`']).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( val == 8 )}yes{;}')
            .sa(jtif, { val: 8 }).val(),
        'yes'
    );

    t.is(jt.use('').reset().sa(jtif, { val: 7 }).val(), '');

});

test('JtIfHandler.process(); main comparison operators', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', '`' ],
    {
        if: '',
        else: '/',
        elif: '/',
        fi: ';',
    });
    
    t.is
    (
        jt.set('', '{( `a` < `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` > `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` <= `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` >= `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` == `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` != `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` !== `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(),
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` === `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );
});

test('JtIfHandler.process(); additional comparison operators', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', '`' ],
    {
        if: '',
        else: '/',
        elif: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{( `a` &lt; `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` &gt; `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` LSS `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` LEQ `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` GTR `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(),
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );

    t.is
    (
        jt.set('', '{( `a` GEQ `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` EQU `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'no'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'yes'
    );

    t.is
    (
        jt.set('', '{( `a` NEQ `b` )}yes{/}no{;}')
            .sa(jtif, { a: 5, b: 7}).val(), 
        'yes'
    );

    t.is
    (
        jt.use('').as(-1, true).sa(jtif, { a: 5, b: 5}).val(), 'no'
    );
});

test('JtIfHandler.process(); boolean in conditional statement', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });
    
    t.is
    (
        jt.set('', '{if()}yes{/}no{;}').sa(jtif, {}).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( false )}yes{/}no{;}').sa(jtif, {}).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( true )}yes{/}no{;}').sa(jtif, {}).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( "false" )}yes{/}no{;}').sa(jtif, {}).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( "true" )}yes{/}no{;}').sa(jtif, {}).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( false )}yes{;}').sa(jtif, {}).val(),
        ''
    );

    t.is
    (
        jt.set('', '{if( true )}yes{;}').sa(jtif, {}).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'yes'
    );

});

test('JtIfHandler.process(); $v == true/false', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == true )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == false )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'no'
    );
});

test('JtIfHandler.process(); $v == (string)true/false', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });
    
    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "true" )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v == "false" )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'no'
    );
});

test('JtIfHandler.process(); === (boolean)', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v === true )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v === "true" )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === true )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v === "true" )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === true )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === "true" )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v === false )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v === "false" )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === false )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v === "false" )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === false )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v === "false" )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'yes'
    );
});

test('JtIfHandler.process();  !== (boolean)', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v !== true )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v !== "true" )}yes{/}no{;}').sa(jtif, { v: true }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== true )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v !== "true" )}yes{/}no{;}').sa(jtif, { v: 'true' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== true )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== "true" )}yes{/}no{;}').sa(jtif, { v: '"true"' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v !== false )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v !== "false" )}yes{/}no{;}').sa(jtif, { v: false }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== false )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'no'
    );

    t.is
    (
        jt.set('', '{if( $v !== "false" )}yes{/}no{;}').sa(jtif, { v: 'false' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== false )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'yes'
    );

    t.is
    (
        jt.set('', '{if( $v !== "false" )}yes{/}no{;}').sa(jtif, { v: '"false"' }).val(),
        'no'
    );
});

test('JtIfHandler.process();  nested JtIfHandler statement for different IJtIfOperator configurations', t =>
{
    const jt    = new Jt();
    const jtif  = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v == 9 )}[if( $v == 2 )]yes2[/]no2[;]{/}no1{;}')
            .sa(jtif, { v: '9' }).val(),
        '[if( $v == 2 )]yes2[/]no2[;]'
    );

    t.is
    (
        jt.use('').sa(jtif, { v: 2 }, [ '[]', { op: '$'} ]).val(),
        'yes2'
    );
});

test('JtIfHandler.process();  optional vcfg', t =>
{
    const jt = new Jt();

    let jtif = new JtIfHandler([ '{}', { op: '$'} ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v == 9 )}[if( $v == 2 )]yes2[;]{;}')
            .sa(jtif, { v: 4 }).val(),
        ''
    );

    t.is
    (
        jt.use('').as(-1, true)
            .sa(jtif, { v: 9 })
            .sa(jtif, { v: 2 }, [ '[]' ]).val(),
        'yes2'
    );


    jtif = new JtIfHandler([ '[]' ],
    {
        if: '',
        else: '/',
        fi: ';',
    });

    t.is
    (
        jt.set('', '{if( $v == 9 )}[if( $v == 2 )]yes2[;]{;}')
            .sa(jtif, { v: 4 }, [ '{}', { op: '$'} ]).val(),
        ''
    );

    t.is
    (
        jt.use('').as(-1, true)
            .sa(jtif, { v: 9 }, [ '{}', { op: '$'} ])
            .sa(jtif, { v: 2 }, [ '[]', { op: '$'} ]).val(),
        'yes2'
    );    
});