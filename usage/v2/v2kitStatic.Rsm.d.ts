﻿interface V2kitStatic {
    /** 运算符 */
    operators: Yep.PlainObject<Function>,
    /** 编译规则 */
    compilers: Yep.PlainObject<Function>,
    /**
     * 按照 type 方式格式化字符串。
     * @param type 类型（值区间：[1,7]）。
     * @param string 需要被格式化的字符串。
     * @param json 格式化字符的入参对象。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     */
    StringCb(type: number, string: string, json: Yep.PlainObject, showMatchStr?: boolean): string;
}


interface String {
    /**
     * 将字符串编译为函数。
     */
    toCode(): (object: object, main: boolean) => any;
    /**
     * 格式化字符串。
     * @param objectN 参数。
     * @see \`{@link https://www.cnblogs.com/vbing/p/10048351.html }\`
     */
    format(...objectN: any[]): string;
    /**
     * 格式化字符串。
     * @param args 参数数组。
     * @see \`{@link https://www.cnblogs.com/vbing/p/10048351.html }\`
     */
    format(args: ArrayLike<any>): string;
    /**
     * 执行字符串。
     * @param json 参数。
     * @returns 返回字符串的运算结果。
     * @example "a + b".compile({a:1, b:2}) // => 3;
     */
    eval(json: Yep.PlainObject): any;
    /**
     * 映射字符串。
     * @param json 参数。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     * @see \`{@link https://www.cnblogs.com/vbing/p/10048901.html }\`
     */
    withCb(json: Yep.PlainObject, showMatchStr?: boolean): string;
    /**
     *编译字符串
     * @param json 参数。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     * @see \`{@link https://www.cnblogs.com/vbing/p/10048901.html }\`
     */
    compileCb(json: Yep.PlainObject, showMatchStr?: boolean): string;
    /**
     * 使用判断的方式格式化字符串。
     * @param json 参数。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     * @see \`{@link https://www.cnblogs.com/vbing/p/10050075.html }\`
     */
    ifCb(json: Yep.PlainObject, showMatchStr?: boolean): string;
    /**
     * 使用遍历的方式格式化字符串。
     * @param json 参数。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     * \`{@link https://www.cnblogs.com/vbing/p/10050240.html }\`
     */
    forCb(json: Yep.PlainObject, showMatchStr?: boolean): string;
    /**
     * 使用遍历的方式格式化字符串。
     * @param array 参数。
     * @param showMatchStr 没有找到属性的时候释放显示原字符串。
     * \`{@link https://www.cnblogs.com/vbing/p/10050240.html }\`
     */
    forCb(array: ArrayLike<any>, showMatchStr?: boolean): string;
}