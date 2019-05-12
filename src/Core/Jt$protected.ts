/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019  Denis Kuzmin < entry.reg@gmail.com > GitHub/3F
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { IJt } from './IJt';
import { Jt as JtBase } from './Jt';
import { IJtConfig } from './IJtConfig';
import { IJtAct } from './IJtAct';
import { IDictionary } from '../Types/IDictionary';
import { JtAct$protected } from './JtAct$protected';

/**
 * Meet Mr. Jt.
 * $protected edition
 */
// Because of tsc, our trivial protection of `Jt` in native JavaScript.
export class Jt$protected implements IJt
{
    /**
     * @param pair Initialize with `IJtConfig.pair()` logic.
     */
    public constructor(pair: string);

    /**
     * @param config Initialize with `IJtConfig` configuration.
     */
    public constructor(config: IJtConfig);
    
    public constructor();

    /**
     * `constructor();`
     * 
     * Initialize {Jt} with default data.
     * 
     * `constructor(pair: string);`
     * 
     * @param pair {string} Initialize with `IJtConfig.pair()` logic.
     * 
     * `constructor(config: IJtConfig);`
     * 
     * @param config {IJtConfig | undefined} Initialize with `IJtConfig` configuration.
     */
    public constructor(config?: any)
    {
        // const _:any = this; // VS Code intellisense will not display anything
        const jt    = new JtBase(config);

        this.use    = jt.use.bind(jt);
        this.set    = jt.set.bind(jt);
        this.nil    = jt.nil.bind(jt);
        this.is     = jt.is.bind(jt);

        this.config = jt.config;

        (<any>jt)._newJtAct = (data?: string) => new JtAct$protected(this, data);
    }


/* API stub */

    /**-_*/ config: IJtConfig = <IJtConfig>{};
    /**-_-*/ use(name: string): IJtAct;
    /**-_-*/ use(name: string, data: string | undefined): IJtAct;
    /**-_-*/ use(name: string[]): IDictionary<IJtAct>;
    /**-_-*/ use(data: IDictionary<string>[]): IDictionary<IJtAct>;
    /**-_-*/ use(name: string | string[] | IDictionary<string>[], data?: string): IJtAct | IDictionary<IJtAct> { throw 8 }
    /**-_-*/ set(name: string, data: string | undefined): IJtAct { throw 8 }
    /**-_-*/ nil(...names: string[]): IJt { throw 8 }
    /**-_-*/ is(name: string): IJtAct | null { throw 8 }

}