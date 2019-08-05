import { getBookImage } from '../../network/netService'
import { isBookInfoAvailable, formatTime } from '../../utils/util'
import { Book } from '../../data/dataModel'

Page({
  data: {
    title: "", // 书名
    frontImage: "", // 图片
    totalPages: 0, // 总页数
    currentPage: 0, // 当前阅读的页数
    lastDate: "", // 最新更新时间 年-月-日
    author: "", // 作者
    description: "", // 简介
    readReason: "", // 初心，阅读理由
    thoughts: undefined, // 感想
    reading: true, // 是否在读
    percent: 0, // 当前进度
    startPage: 0,
    endPage: 0,
    publishHouse: "",
    publishDate: "",
    openThoughtButton: false,
    pageFrom: 1,
    currentTitle: "" // 删除时用
  },
  onLoad(option: any) {
    console.log(option);
    if (Number(option.from) === 0) {
      // 扫码过来的
      if (option.errMessage) {
        // 说明有错误
        this.setData!({
          pageFrom: 0
        })
        wx.showToast({
          title: option.errMessage,
          icon: 'none',
          duration: 2000
        })
      } else {
        let pages: string = option.totalPages ? option.totalPages : '0';
        let length: number = pages.length;
        if (pages.lastIndexOf('页') !== -1) {
          pages = pages.substring(0, length - 1);
        }
        this.setData!({
          title: option.title ? option.title : "",
          author: option.author ? option.author : "",
          frontImage: option.imageId ? getBookImage(option.imageId) : "",
          publishHouse: option.publishHouse ? option.publishHouse : "",
          totalPages: Number(pages),
          pageFrom: 0,
          currentTitle: option.title ? option.title : "",
        })
      }
    } else if (Number(option.from) === 1) {
      console.log("点击手动添加进来的")
      this.setData!({
        pageFrom: 1
      })
    } else if (Number(option.from) === 2) {
      this.setData!({
        title: option.title,
        author: option.author,
        frontImage: option.frontImage ? option.frontImage : getBookImage(option.imageId),
        publishHouse: option.publishHouse,
        totalPages: Number(option.totalPages),
        currentPage: Number(option.currentPage),
        publishDate: option.publishDate,
        lastDate: option.lastDate,
        reading: option.reading,
        readReason: option.readReason,
        startPage: Number(option.startPage),
        endPage: Number(option.endPage),
        percent: Number(option.percent),
        description: option.description,
        pageFrom: 2,
        currentTitle: option.title
      })
    }

  },
  clickImage() {
    const pageThis = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        pageThis.setData!({
          frontImage: res.tempFilePaths[0]
        });
      }
    });
  },
  bookNameInput: function (e: any) {
    this.setData!({
      title: e.detail.value
    })
  },
  bookAuthorInput: function (e: any) {
    this.setData!({
      author: e.detail.value
    })
  },
  bookTotalPageInput: function (e: any) {
    this.setData!({
      totalPages: Number(e.detail.value)
    })
  },
  readingStatusChange: function (e: any) {
    this.setData!({
      reading: e.detail.value
    })
  },
  bookStartInput: function (e: any) {
    let start: number = 0;
    try {
      start = Number(e.detail.value);
    } catch (e) {
      start = this.data.startPage;
    }
    console.log(start);
    this.setData!({
      startPage: start
    })
  },
  bookEndInput: function (e: any) {
    let end: number = 0;
    try {
      end = Number(e.detail.value);
    } catch (e) {
      end = this.data.startPage;
    }
    console.log(end);
    this.setData!({
      endPage: end
    })
  },
  bookReasonInput: function (e: any) {
    this.setData!({
      readReason: e.detail.value
    })
  },
  bookPublishHouseInput: function (e: any) {
    this.setData!({
      publishHouse: e.detail.value
    })
  },
  bookPublishDateInput: function (e: any) {
    this.setData!({
      publishDate: e.detail.value
    })
  },
  bookDescriptionInput: function (e: any) {
    this.setData!({
      description: e.detail.value
    })
  },
  clickUpdateSave() {
    // 保存书籍信息
    let tempPercent = 0;
    let tempPages: number = this.data.endPage - this.data.startPage;
    console.log(tempPages);
    if (this.data.totalPages !== 0) {
      tempPercent = tempPages * 100 / this.data.totalPages;
    }
    let tempCurrent: number = this.data.currentPage + tempPages;
    let date: string = formatTime(new Date());
    const book: Book = {
      title: this.data.title,
      frontImage: this.data.frontImage,
      author: this.data.author,
      totalPages: this.data.totalPages,
      readReason: this.data.readReason,
      reading: this.data.reading,
      currentPage: tempCurrent,
      lastDate: date,
      description: this.data.description,
      thoughts: this.data.thoughts,
      percent: tempPercent,
      startPage: this.data.startPage,
      endPage: this.data.endPage,
      publishDate: this.data.publishDate,
      publishHouse: this.data.publishHouse
    }
    let errMessage = isBookInfoAvailable(book);
    if (errMessage) {
      // 有问题，弹出toast提示
      wx.showToast({
        title: errMessage,
        icon: 'none',
        duration: 2000
      });
    } else {
      // 没有问题，可以保存
      console.log(book);
      wx.showLoading({
        title: "正在保存...",
        mask: true
      });
      let books: Array<Book> = wx.getStorageSync("books");
      if (books) {
        if (this.data.pageFrom === 2) {
          // 说明是编辑
          books = books.filter(value => value.title !== this.data.currentTitle);
          books.push(book);
          this.saveBooks(books);
          return;
        }
        let tempBook: Array<Book> = books.filter(value => value.title === this.data.currentTitle);
        if (tempBook.length > 0) {
          wx.hideLoading();
          wx.showModal({
            title: "同名提示",
            content: "“" + book.title + "”已经存在，是否覆盖？",
            success: (res) => {
              if (res.confirm) {
                wx.showLoading({
                  title: "正在保存...",
                  mask: true
                });
                books = books.filter(value => value.title !== tempBook[0].title);
                books.push(book);
                this.saveBooks(books);
              }
            }
          });
        } else {
          books.push(book);
          this.saveBooks(books);
        }
      } else {
        books = [];
        books.push(book);
        this.saveBooks(books);
      }
    }
  },
  saveBooks(books: Array<Book>) {
    let tempBooks: Array<Book> = books.reverse();
    wx.setStorage({
      key: "books",
      data: tempBooks,
      success: () => {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        })
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: "保存失败",
          icon: "none",
          duration: 2000
        });
      }
    })
  },
  clickDelete() {
    wx.showModal({
      title: "删除",
      content: "确定要删除吗？",
      success: (res) => {
        if (res.confirm) {
          let books: Array<Book> = wx.getStorageSync("books");
          if (books) {
            books = books.filter(value => value.title !== this.data.currentTitle);
            this.saveBooks(books);
          }
        }
      }
    });
  }
})