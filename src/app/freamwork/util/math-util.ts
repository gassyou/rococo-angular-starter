import {Injectable} from "@angular/core";


/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 *
 * 小数默认精确12位
 * Number类型范围 (2^53 - 1) ~ -((2^53 - 1))
 */
@Injectable()
export class MathUtil {

  public static ROUND_HALF_UP = 1;
  public static ROUND_UP = 2;
  public static ROUND_DOWN = 3;

  constructor() {
  }

  private _boundaryCheckingState = false;

  private _precision = 12;

  /**
   * 是否进行边界检查，默认开启
   * @param flag 标记开关，true 为开启，false 为关闭，默认为 false
   */
  public enableBoundaryChecking(flag) {
    this._boundaryCheckingState = flag;
  }

  public setPrecision(value) {
    this._precision = value;
  }

  public demo() {
    console.log('0.1 + 0.2 = ' + (0.1 + 0.2));
    console.log('mathUtil：0.1 + 0.2 = ' + this.plus(0.1, 0.2));
    console.log('\n');
    console.log('2.3 + 2.4 = ' + (2.3 + 2.4));
    console.log('mathUtil：2.3 + 2.4 = ' + this.plus(2.3, 2.4));
    console.log('\n');
    console.log('0.3 - 0.2 = ' + (0.3 - 0.2));
    console.log('mathUtil：0.3 - 0.2 = ' + this.minus(0.3, 0.2));
    console.log('\n');
    console.log('1 - 0.9 = ' + (1 - 0.9));
    console.log('mathUtil：1 - 0.9 = ' + this.minus(1, 0.9));
    console.log('\n');
    console.log('19.9 * 100 = ' + (19.9 * 100));
    console.log('mathUtil：19.9 * 100 = ' + this.times(19.9, 100));
    console.log('\n');
    console.log('0.3 / 0.1 = ' + (0.3 / 0.1));
    console.log('mathUtil：0.3 / 0.1 = ' + this.divide(0.3, 0.1));
    console.log('\n');
    console.log('0.1^2 = ' + Math.pow(0.1, 2));
    console.log('mathUtil：0.1^2 = ' + this.pow(0.1, 2));
    console.log('\n');
    console.log('0.05 round（decimal：1）：' + this.round(0.05, 1));
    console.log('0.04 ceil（decimal：1）：' + this.ceil(0.04, 1));
    console.log('0.06 floor（decimal：1）：' + this.floor(0.06, 1));
    console.log('\n');
  }

  /**
   * 把错误的数据转正
   * strip(0.09999999999999998)=0.1
   */
  public strip(num: number, precision?): number {
    return +parseFloat(num.toPrecision(precision ? precision : this._precision));
  }

  /**
   * 精确加法
   */
  public plus(num1: number, num2: number, ...others: number[]): number {
    if (others.length > 0) {
      return this.plus(this.plus(num1, num2), others[0], ...others.slice(1));
    }
    const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
    return this.strip((this.times(num1, baseNum) + this.times(num2, baseNum)) / baseNum);
  }

  /**
   * 精确减法
   */
  public minus(num1: number, num2: number, ...others: number[]): number {
    if (others.length > 0) {
      return this.minus(this.minus(num1, num2), others[0], ...others.slice(1));
    }
    const baseNum = Math.pow(10, Math.max(this.digitLength(num1), this.digitLength(num2)));
    return this.strip((this.times(num1, baseNum) - this.times(num2, baseNum)) / baseNum);
  }

  /**
   * 精确乘法
   */
  public times(num1: number, num2: number, ...others: number[]): number {

    if (others.length > 0) {
      return this.strip(this.times(this.times(num1, num2), others[0], ...others.slice(1)));
    }
    const num1Changed = this.floatToInteger(num1);
    const num2Changed = this.floatToInteger(num2);
    const baseNum = this.digitLength(num1) + this.digitLength(num2);
    const leftValue = num1Changed * num2Changed;

    this.checkBoundary(leftValue);

    return this.strip(leftValue / Math.pow(10, baseNum));
  }

  /**
   * 精确除法
   */
  public divide(num1: number, num2: number, ...others: number[]): number {
    if (others.length > 0) {
      return this.divide(this.divide(num1, num2), others[0], ...others.slice(1));
    }
    const num1Changed = this.floatToInteger(num1);
    const num2Changed = this.floatToInteger(num2);
    this.checkBoundary(num1Changed);
    this.checkBoundary(num2Changed);
    return this.strip(this.times((num1Changed / num2Changed), Math.pow(10, this.digitLength(num2) - this.digitLength(num1))));
  }

  /**
   * 精确乘方
   */
  public pow(num: number, exponent: number): number {
    if (exponent == 1) {
      return num;
    }
    const nums: number[] = [];
    for (let i = 0; i < exponent; i++) {
      nums.push(num);
    }
    if (nums.length == 2) {
      return this.strip(this.times(nums[0], nums[1]));
    } else {
      const [num1, num2, ...others] = nums;
      return this.strip(this.times(num1, num2, ...others));
    }

  }

  /**
   * 四舍五入
   */
  public round(num: number, decimal: number = 0): number {
    const base = Math.pow(10, decimal);
    return this.divide(Math.round(this.times(num, base)), base);
  }

  /**
   * 向上取舍
   */
  public ceil(num: number, decimal: number = 0): number {
    const base = Math.pow(10, decimal);
    return this.divide(Math.ceil(this.times(num, base)), base);
  }

  /**
   * 向下取舍
   */
  public floor(num: number, decimal: number = 0): number {
    const base = Math.pow(10, decimal);
    return this.divide(Math.floor(this.times(num, base)), base);
  }

  /**
   * 取舍
   * @param num 需要取舍的数
   * @param roundingMode 取舍模式: <br/>ROUND_HALF_UP = 1，<br/>ROUND_UP = 2，<br/>ROUND_DOWN = 3
   *
   * @param decimal 需要保留的小数位（默认0）
   */
  public setScale(num: number, roundingMode: number, decimal: number = 0) {
    switch (roundingMode) {
      case MathUtil.ROUND_HALF_UP:
        return this.round(num, decimal);
      case MathUtil.ROUND_UP:
        return this.ceil(num, decimal);
      case MathUtil.ROUND_DOWN:
        return this.floor(num, decimal);
      default:
        return num;
    }
  }

  /**
   * 取舍(若为整数，补0)
   * @param num 需要取舍的数
   * @param roundingMode 取舍模式: <br/>ROUND_HALF_UP = 1，<br/>ROUND_UP = 2，<br/>ROUND_DOWN = 3
   *
   * @param decimal 需要保留的小数位（默认0）
   */
  public setScaleWithZero(num: number, roundingMode: number, decimal: number = 0) {
    switch (roundingMode) {
      case MathUtil.ROUND_HALF_UP:
        return this.addZero(this.round(num, decimal), decimal);
      case MathUtil.ROUND_UP:
        return this.addZero(this.ceil(num, decimal), decimal);
      case MathUtil.ROUND_DOWN:
        return this.addZero(this.floor(num, decimal), decimal);
      default:
        return num;
    }
  }

  private addZero(num: number, decimal) {
    let numStr = num.toString();
    let index = numStr.indexOf('.');
    if (index < 0) {
      index = numStr.length;
      numStr += '.';
    }
    while (numStr.length <= index + decimal) {
      numStr += '0';
    }
    return numStr;
  }

  /**
   * 返回小数位长度
   * @param {*number} num 输入数
   */
  public digitLength(num: number): number {
    const eSplit = num.toString().split(/[eE]/);
    const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
  }

  /**
   * 把小数转成整数，支持科学计数法。
   * @param {*number} num 输入数
   */
  public floatToInteger(num: number): number {
    if (num.toString().indexOf('e') === -1) {
      return Number(num.toString().replace('.', ''));
    }
    const dLen = this.digitLength(num);
    return dLen > 0 ? this.strip(num * Math.pow(10, dLen)) : num;
  }

  /**
   * 检测数字是否越界，如果越界给出提示
   * @param {*number} num 输入数
   */
  public checkBoundary(num: number) {
    if (this._boundaryCheckingState) {
      if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
        console.warn(`${num} 超出Number类型边界, 结果可能不准确`);
      }
    }
  }
}
