/*
 * @Author: yvesyfzhang yvesyfzhang@tencent.com
 * @Date: 2022-05-19 12:37:59
 * @LastEditors: yvesyfzhang yvesyfzhang@tencent.com
 * @LastEditTime: 2022-05-19 14:45:03
 * @FilePath: /sv-cli/sv-cli/bin/landun.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const axios = require('axios')
const ora = require('ora')
const chalk = require('chalk')
const { getLocalConfigs, getPageConfig } = require('../utils/getConfigs');

async function start (params) {
  const localConfigs = getLocalConfigs();
	const { landun = {} } = localConfigs;
  if(!landun?.trigger){
    console.log(
      chalk.red(
        `\n 触发蓝盾配置为空！ \n`
      )
    )
    return
  }
  return new Promise((resolve, reject) => {
    const spinner = ora(chalk.green(`正在远程触发蓝盾流水线!\n`)).start()
    axios
      .post(
        landun?.trigger,
        {
          ...params
        }
      )
      .then(res => {
        if (res.data.status === 0) {
          const { data } = res.data
          spinner.stop()
          console.log(
            chalk.green(
              `\n 蓝盾流水线触发成功:\n ${landun?.pageUrl}${data.id} \n`
            )
          )
        } else {
          spinner.stop()
          console.log(chalk.red(`\n 蓝盾流水线触发失败！\n`))
          reject(false)
        }
      })
      .catch(err => {
        console.log(err)
        console.log(chalk.red(`\n 蓝盾流水线触发失败！\n`))
        reject(err)
      })
  })
}

module.exports = {
  start
}
