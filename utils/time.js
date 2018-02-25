import moment from '../utils/resources/moment.min.js';
/**
 * @Title: 时间处理-工具类提供一些便捷地工具服务
 * @Author: Mad Dragon 【 395548460@qq.com 】
 * @Date: 2017/11/22 22:00
 * @Version V2.0.2
 *
 * =====================================================================
 * @Description: 工具索引
 *     1、isRefundOrder 根据订单状态 判断 是否是退款单
 *     2、formatAddTime 时间 加法 并 格式化时间
 *     3、formatSubtractTime 时间 减法 并 格式化时间
 *     4、formatInitTime 格式化 初始 时间
 * ============================================================================
 */

let util = {};
/**
 * @Title: 1、格式化时间
 * @Author: Mad Dragon 【 395548460@qq.com 】
 * @Date: 2017/11/22 20:33
 * @Version V2.0.2
 *
 * @param time 需要格式化时间  默认当前时间
 * @param norms 格式化规则 默认 YYYY-MM-DD
 *
 * @Description:
 */
util.formatTime = function(time = new Date(), norms = 'YYYY-MM-DD') {
  return (time && moment(time).format(norms)) || '';
};

/**
 * @Title: 2、时间 加法 并 格式化时间
 * @Author: Mad Dragon 【 395548460@qq.com 】
 * @Date: 2017/11/22 20:33
 * @Version V2.0.2
 *
 * @param time 需要格式化时间  默认当前时间
 * @param norms 格式化规则 默认 YYYY-MM-DD
 * @param addNum 加数
 * @param addNorms 加法规则 默认 'days'
 *
 * @Description:
 */
util.formatAddTime = function(
  time = new Date(),
  norms = 'YYYY-MM-DD',
  addNum = 1,
  addNorms = 'days'
) {
  return (
    (time &&
      moment(time)
        .add(addNum, addNorms)
        .format(norms)) ||
    ''
  );
};
/**
     * 为数字加上单位：万
     *
     * 例如：
     *      1000.01 => 1000.01
     *      10000 => 1万
     *      99000 => 9.9万
     *      566000 => 56.6万
     *      5660000 => 566万
     *      44440000 => 4444万
     *      11111000 => 1111.1万
     *
     * @param {number} input 输入数字.
     */
util.NumberUpperFormat = function(input) {
  // const units = [
  //     {num: 4, unit: '万'},
  //     {num: 6, unit: '百万'},
  //     {num: 7, unit: '千万'},
  //     {num: 8, unit: '亿'}
  //   ];
  // 精确到整数，直接用js自带方法input.toFixed(0)也可以
  if (input > 999) {
    const num = input / 10000;
    return `${num.toFixed(2)}万`;
  }
  //   const num = String(input.toFixed(0));
  //   return `${num.slice(0, num.length - 4)}.${num.slice( num.length - 4,num.length - 2)}万`;
  // 保证前面至少留两位
  //   const len = num.length - 1;
  //   let isFind = false;
  //   for (let i = 0, length = units.length; i < length; i++) {
  //       let item = units[i];
  //       if (len >= item.num && len < units[i + 1].num) {
  //           isFind = true;
  //       } else if (i === (length - 2)) {
  //           isFind = true;
  //           item = units[++i];
  //       }
  //       if (isFind) {
  //           // 确认区间后，返回前几位加上单位
  //           return `${num.slice(0, num.length - item.num)}.${num.slice(num.length - item.num, num.length - item.num+2)}${item.unit}`;
  //       }
  //   }
};
/**
 * @Title: 3、时间 减法 并 格式化时间
 * @Author: Mad Dragon 【 395548460@qq.com 】
 * @Date: 2017/11/23 16:28
 * @Version V2.0.2
 *
 * @param time 需要格式化时间  默认当前时间
 * @param norms 格式化规则 默认 YYYY-MM-DD
 * @param addNum 减数
 * @param addNorms 减法规则 默认 'days'
 *
 * @Description:
 */
util.formatSubtractTime = function(
  addNum = 1,
  addNorms = 'days',
  time = new Date(),
  norms = 'YYYY-MM-DD'
) {
  return (
    (time &&
      moment(time)
        .subtract(addNum, addNorms)
        .format(norms)) ||
    ''
  );
};

/**
 * @Title: 4、格式化 初始 时间
 * @Author: Mad Dragon 【 395548460@qq.com 】
 * @Date: 2017/11/24 13:59
 * @Version V2.0.2
 *
 * @param time 初始时间
 * @param norms 时间格式化规则
 * @return string 2017-11-24
 *
 * @Description:
 */
util.formatInitTime = function(time = new Date(), norms = 'YYYY-MM-DD') {
  return (time && moment(time).format(norms)) || '';
};

util.startTime = function(time = new Date(), norms = 'YYYY-MM-DD') {
  return (
    (util.formatInitTime(time) &&
      moment(util.formatInitTime(time)).format(norms)) ||
    ''
  );
};

util.endTime = function(
  time = new Date(),
  norms = 'YYYY-MM-DD',
  addNum = 1,
  addNorms = 'days'
) {
  return (
    (util.formatInitTime(time) &&
      moment(util.formatInitTime(time))
        .add(addNum, addNorms)
        .format(norms)) ||
    ''
  );
};

/**
 * 获取时间期限
 * n 时间段 p 时间类型 norms 时间格式
 * 例如 n:1 p:weeks norms:YYYY-MM-DD HH:mm:ss
 */
util.getTimeLimit = function(n = 0, p = 'days', norms = 'YYYY-MM-DD HH:mm:ss') {
  return util.startTime(
    moment()
      .subtract(n, p)
      .format(norms),
    'x'
  );
};

/**
 * 获取昨天、今天判断
 * time 时间 type 时间类型 1 昨天 2 今天
 * 例如 time:new Date() type:1
 */
util.isDayType = function(time = new Date(), type = 1) {
  if (type == 1) {
    return moment(time).isBetween(
      util.formatSubtractTime(2),
      util.formatSubtractTime(0),
      'day'
    );
  }
  if (type == 2) {
    return moment(time).isBetween(
      util.formatSubtractTime(1),
      util.formatSubtractTime(-1),
      'day'
    );
  }
  return false;
};

/**
 * 获取今年之前的判断
 * time 时间 : true 之前 false 不是之前
 * 例如 time:new Date()
 */
util.islastYear = function(time = new Date()) {
  let lastYear = util.formatSubtractTime(0, 'years', new Date(), 'YYYY');
  let islastYear = moment(time).isBefore(lastYear, 'year');
  return islastYear;
};

// export default util;
module.exports = util;
