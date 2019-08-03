export interface Book {
  title: String; // 标题
  frontImage: String; // 图片
  totalPages: number; // 总页数
  currentPage?: number; // 当前阅读的页数
  startPage?: number; // 起始页数
  endPage?: number; // 终止页数
  lastDate?: String; // 最新更新时间 年-月-日
  author: String; // 作者
  description?: String; // 简介
  readReason: String; // 初心，阅读理由
  thoughts?: Thought; // 感想
  reading: boolean; // 是否在读
  percent?: number; // 当前进度
  publishHouse?: ""; // 出版社
  publishDate?: ""; // 出版时间
}

export interface Thought {
  date: string; // 时间 年月日
  startPage: String; // 起始页数
  endPage: String; // 终止页数
  content: Array<string>; // 感想内容
}
