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
import { IJtConfig } from './IJtConfig';
import { IJtAct } from './IJtAct';
import { JtAct as JtActBase } from './JtAct';
import { IDictionary } from '../Types/IDictionary';
import { IJtHandler } from '../Handlers/IJtHandler';

/**
 * Because of tsc, our trivial protection of `JtAct` in native JavaScript.
 */
export class JtAct$protected implements IJtAct
{
    /**
     * @param jt {IJt} Parent IJt container.
     * @param data {string | undefined} Initial data for the chain.
     */
    public constructor(jt: IJt, data: string | undefined = undefined)
    {
        // const _:any = this; // VS Code intellisense will not display anything
        const act   = new JtActBase(jt, data);

        this.jt     = act.jt.bind(act);
        this.as     = act.as.bind(act);
        this.sa     = act.sa.bind(act);
        this.clear  = act.clear.bind(act);
        this.value  = act.value.bind(act);
        this.val    = act.val.bind(act);
        this.eject  = act.eject.bind(act);
        this.reset  = act.reset.bind(act);
        this.top    = act.top.bind(act);
        this.bind   = act.bind.bind(act);
    }
    

/* API stub */

    /**-_-*/ jt(): IJt { throw 8 }
    /**-_-*/ as(index: number, offset?: boolean): IJtAct;
    /**-_-*/ as(values: IDictionary<any>): IJtAct;
    /**-_-*/ as(values: IDictionary<any>, pair: string): IJtAct;
    /**-_-*/ as(values: IDictionary<any>, cfg: IJtConfig): IJtAct;
    /**-_-*/ as(values: any, cfg?: any): IJtAct { throw 8 }
    /**-_-*/ sa(handler: IJtHandler, values?: IDictionary<any> | undefined): IJtAct { throw 8 }
    /**-_-*/ clear(): IJtAct { throw 8 }
    /**-_-*/ value(): string | undefined { throw 8 }
    /**-_-*/ val(): string { throw 8 }
    /**-_-*/ eject(cb: (v: string | undefined) => void): IJtAct { throw 8 }
    /**-_-*/ reset(): IJtAct { throw 8 }
    /**-_-*/ top(): IJtAct { throw 8 }
    /**-_-*/ bind(raw: string | undefined, values?: IDictionary<any>, config?: IJtConfig): string | undefined { throw 8 }

}
