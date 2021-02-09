// components/quotation/index.js
const { getBoardInfo, getRankInfo } = require("../../network/netManager.js");
Component({
  lifetimes: {
    ready() {
      console.log('行情 ready');
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    current: Number,
    contentWidth: Number,
    contentHeight: Number
  },

  observers: {
    'current': function(index) {
      if(index === 1) {
        this.refresh();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    boardData: [],
    rankData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh() {
      var _this = this;
      getBoardInfo(function (params) {
        console.log('board ', params)
        _this.setData({
          boardData: params
        });
      }, function (error) {
        console.log('error: ', error);
      });
      getRankInfo(function(params) {
        console.log('rank ', params)
        _this.setData({
          rankData: params
        });
      }, function(error) {

      })
    }
  }
})
