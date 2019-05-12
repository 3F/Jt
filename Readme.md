
# Mr. [Jt 🎩](https://github.com/3F/Jt) 

Meet beardless сustomizable template engine, Mr. Jt for Node.js and Web browsers.

[![release-src](https://img.shields.io/github/release/3F/Jt.svg)](https://github.com/3F/Jt/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-74A5C2.svg)](https://github.com/3F/Jt/blob/master/License.txt)

**Download:** 
* Stable: [/releases](https://github.com/3F/Jt/releases) [ [latest](https://github.com/3F/Jt/releases/latest) ]
* CI builds: [`/artifacts` page](https://ci.appveyor.com/project/3Fs/jt/history) or find as `Pre-release` with mark `🎲 Nightly build` on [GitHub Releases](https://github.com/3F/Jt/releases) page.

```javascript
jt.use('', 'Hello %p% world')
    .as({ p: 'amazing'})
    .reset().as({ p: 'crazy'});
```

```javascript
jt.use('s1', 'Today is a {( a < b )} good {/} bad {;} day!')
    .sa(jtif, { a: 5, b: 7})
    .value()
```

## Why Jt ?

Extremely small, fast, and damn customizable. Okay, Let's see what's going on:

### Speed 🚀

Only **native** lower-level implementation. Even for conditional statements, like:

```
{( d > 5 )} yes {/} no {;}
```

Which do **not** uses `regex`, or `eval()`, or `new Function()`, ... Feel the speed.

### Size 📦

Extra small size. Just about o-n-e kilobyte of fully workable core engine:
* ~ **1.02 KB** for Core of ES6 gzipped; 
* ~ 1.09 KB for Core of **ES3** gzipped;

Same things for custom handlers.

### Configurable 🔧

You can configure, add, or change anything!

Jt was designed to be loyal to your preferences *on the fly*. Maybe for this:

```javascript
jt.use('s1', 'Good {{p}}, $p -p- !')
    .as({ p: 'Jt' })
    .as({ p: 'Mr.' }, {op: '$'})
    .as({ p: 'morning' }, '{{}}')
    .val(),
```

Or for this:

```javascript

// {( true )} yes {/} no {;} -> {if( true )} yes {else} no {endif}
    
jt.use('legacy', '{if( true )} yes {else} no {endif}!')
.sa(new JtIfHandler([ '{}' ],
{
    if: 'if',
    else: 'else',
    fi: 'endif',
}))
.val() // yes !
```

Or for something more ...

### Extensible via Pluginable handlers 🗃

Sure! Add or change any features for the layers, still *on the fly*.

Do you need something special? No problem, just implement [IJtHandler](src/Handlers/IJtHandler.ts) to cover your awesome things. It easy.

### Comfy but strong 🌇

Changeable layers through common chain will make you happy.

You can control everything just in a few steps:

```javascript
jt.use('hello', 'Hello you from $tip, dear $name.')
    .as({ tip: 'Jt', name: 'John' }); // Hello you from Jt, dear John.

// ...

jt.use('hello')
    .as(-1, true)
    .as({ name: 'Denis' }) // Hello you from Jt, dear Denis.
    .reset()
    .as({ tip: 'Moscow' })
    .eject((v) => t.is(v, 'Hello you from Moscow, dear $name.'))
    ...
    .as({ name: '{( r > 100 )}friend{/}visitor{;}' })
    .sa(jtif, { r: actual })
    ...
    .val();
🐧
```

### Stability 🗠

Clean [API](src/Core/) and its [tests](tests/) will take care of your peace of mind.

### Compatibility 🗸

Nothing special, we just provide separate ES3+/ES6+ support in Node.js and Web browsers environment. Choose more suitable package for your case.

### No dependencies to something 👐

Developed from scratch without dependencies to something.

### Open and Free 🍰

MIT License, Enjoy!

## License

Licensed under the [MIT License (MIT)](https://github.com/3F/Jt/blob/master/License.txt)

```
Copyright (c) 2019  Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
```

[ [ ☕ Donate ](https://3F.github.com/Donation/) ]

## API

* Core: [IJt](https://github.com/3F/Jt/blob/master/src/Core/IJt.ts) ➟ [IJtAct](https://github.com/3F/Jt/blob/master/src/Core/IJtAct.ts)
* Configuration: [IJtConfig](https://github.com/3F/Jt/blob/master/src/Core/IJtConfig.ts)
* Handlers: [IJtHandler](https://github.com/3F/Jt/blob/master/src/Handlers/IJtHandler.ts)

## Versions

TODO:

## Build & Tests

```
npm install
gulp build --conf debug
```

Available tests can be raised by command:

```
npm test
```

We're waiting for your awesome contributions!