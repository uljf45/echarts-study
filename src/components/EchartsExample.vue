<template>
  <div>
    <div class="title" ref="title">图表样例</div>
    <div class="container-outer">
      <div id="container" ref="echartContainer" :style="containerStyle" ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EchartsExample',
  data () {
    return {
      theme: 'dark', // light dark ''
      myChart: null,
      containerStyle: {
        width: '600px',
        height: '800px'
      },
      baseOption: {
        // 全局调色盘
        color: ['#003531', '#2f0054', '#61a000', '#008265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
        title: {
          text: 'Echarts 入门示例'
        },
        // backgroundColor: '#2c343c',
        textStyle: {
          // color: 'rgba(255, 255, 255, 0.3)'
        },
        tootip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: [
            '衬衫',
            '羊毛衫',
            '雪纺衫',
            '裤子',
            '高跟鞋',
            '袜子'
          ]
        },
        yAxis: {}
      },
      option: null,
      datasetOptions: null,
      timer: null,
      time: 0,
      hook: null // function (myChart) {...}
    }
  },
  methods: {
    makeOptions1 () {
      const series = [
        {
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        },
        {
          // 自己的调色盘
          color: ['#006b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'],
          type: 'pie',
          center: ['65%', 60],
          radius: 35,
          roseType: 'angle', // 显示成南丁格尔图
          itemStyle: {
            // color: '#00ff31',
            emphasis: {
              // color: '#00ffff',
              shadowBlur: 100,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(255, 0, 0, 1)'
            },
            shadowBlur: 100,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            textStyle: {
              // color: 'rgba(255, 255, 0, 0.3)'
            }
          },
          labelLine: {
            lineStyle: {
              // color: 'rgba(255, 255, 255, 0.3)'
            }
          },
          data: [
            {
              name: 'XX',
              value: 52,
              itemStyle: {
                color: '#ffff31',
                emphasis: {
                  color: '#000fff',
                  shadowBlur: 100,
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  shadowColor: 'rgba(255, 0, 0, 1)'
                },
                shadowBlur: 100,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            { name: 'YY', value: 54 },
            { name: 'ZZ', value: 82 }
          ]
        }
      ]
      const tmp = Object.assign({}, this.baseOption, { series: series })
      this.option = tmp
    },
    makeOptions2 () {
      /* eslint-disable no-multi-spaces,quote-props */
      const tmp2 = Object.assign({}, {
        legend: {},
        tooltip: {},
        dataset: {
          // 提供一份数据
          // source: [
          //   ['product',       '2015', '2016', '2017'],
          //   ['Matcha Latte',   43.3,   85.8,    93.7],
          //   ['Milk Tea',       83.1,   73.4,    55.1],
          //   ['Cheese Cocoa',   86.4,   65.2,    82.5],
          //   ['Walnut Brownie', 72.4,   53.9,    39.1]
          // ]
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
            { product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7 },
            { product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1 },
            { product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5 },
            { product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1 }
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      })
      /* eslint-enable no-multi-spaces,quote-props */
      this.datasetOptions = tmp2
    },
    makeOptions3 () {
      /* eslint-disable no-multi-spaces,quote-props */
      const tmp3 = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product',     '2012', '2013', '2014', '2015'],
            ['Matcha Latte', 41.1,   30.4,    65.1,   53.3],
            ['Milk Tea',     86.5,   92.1,    85.7,   83.1],
            ['Cheese Cocoa', 24.1,   67.2,    79.5,   86.4]
          ]
        },
        xAxis: [
          { type: 'category', gridIndex: 0 },
          { type: 'category', gridIndex: 1 }
        ],
        yAxis: [
          { gridIndex: 0 },
          { gridIndex: 1 }
        ],
        grid: [
          { bottom: '55%' },
          { top: '55%' }
        ],
        series: [
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, encode: { x: 'product', y: '2012' } },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, encode: { x: 'product', y: '2013' } },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, encode: { x: 'product', y: '2014' } },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1, encode: { x: 'product', y: '2015' } }
        ]
      }
      /* eslint-enable no-multi-spaces,quote-props */
      this.datasetOptions = tmp3
    },
    makeOptions4 () {
      let timer = null
      /* eslint-disable no-multi-spaces,quote-props */
      const tmp4 = {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: [
            ['product',       '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Matcha Latte',   41.1,   30.4,   65.1,   53.3,   83.8,    98.7],
            ['Milk Tea',       86.5,   92.1,   85.7,   83.1,   73.4,    55.1],
            ['Cheese Cocoa',   24.1,   67.2,   79.5,   86.4,   65.2,    82.5],
            ['Walnut Brownie', 55.2,   67.1,   69.2,   72.4,   53.9,    39.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: { gridIndex: 0 },
        grid: { top: '55%' },
        series: [
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          { type: 'line', smooth: true, seriesLayoutBy: 'row' },
          {
            type: 'pie',
            id: 'pie',
            radius: '30%',
            center: ['50%', '25%'],
            label: {
              formatter: '{b}: {@2012} ({d}%)'
            },
            encode: {
              itemName: 'product',
              value: '2012',
              tooltip: '2012'
            }
          }
        ]
      }
      /* eslint-enable no-multi-spaces,quote-props */
      this.datasetOptions = tmp4
      let old = new Date().getTime()
      let now = new Date().getTime()
      const duration = 300

      function cb (myChart, event) {
        clearTimeout(timer)
        old = new Date().getTime()
        const xAxisInfo = event.axesInfo[0]
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1
          myChart.setOption({
            series: {
              id: 'pie',
              label: {
                formatter: '{b}: {@[' + dimension + ']} ({d}%)'
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          })
        }
      }

      this.hook = function (myChart) {
        myChart.on('updateAxisPointer', function (event) {
          clearTimeout(timer)
          now = new Date().getTime()
          if (now >= old + duration) {
            cb(myChart, event)
          } else {
            const release = old + duration - now
            timer = setTimeout(() => {
              cb(myChart, event)
            }, release)
          }
        })
      }
    }
  },
  created () {
    // this.makeOptions1()
    // this.makeOptions2()
    // this.makeOptions3()
    this.makeOptions4()
  },
  mounted () {
    this.myChart = this.$echarts.init(this.$refs.echartContainer, this.theme)
    // this.myChart.setOption(this.option)
    this.myChart.showLoading()
    if (this.hook) {
      this.hook(this.myChart)
    }
    setTimeout(() => {
      // this.myChart.setOption(this.option)
      this.myChart.setOption(this.datasetOptions || this.option)
      this.myChart.hideLoading()
    }, 500)
  }
}
</script>

<style scoped>
  .title {
    padding: 10px;
  }
  .container-outer {
    width: 100%;
    min-width: 640px;
    display: flex;
    justify-content: center;
  }
</style>
