import React, { Component } from 'react';
import { Pagination } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../base'
import './main.less'

class Main extends Component {
  constructor() {
    super()
    this.goArticle = this.goArticle.bind(this)
    this.likehandler = this.likehandler.bind(this)
    this.getAllArticle = this.getAllArticle.bind(this)
    this.reArticle = this.reArticle.bind(this)
    this.state = {
      news: [],
      nowType: null,
      total: null,
      likeStyle: {
        backgroundColor: '#ffc508b9'
      }
    }
  }
  componentDidMount () {
    // UI事件
    this.switchActive()

    // 获取所有文章数据
    this.getAllArticle(1, 2)
  }
  /**
   * 
   * @param {*} pageNum 页码(第一页为0)
   * @param {1 or 2} con 1: 最新; 2:最热
   */
  getAllArticle (pageNum, con) {
    const _ = this.state
    _.nowType = con
    this.setState({ ..._ })
    let url = `${BASE_URL}/api/v2/article`
    switch (con) {
      case 1:
        url += '/latest'
        break;
      case 2:
        url += '/hotest'
        break;
      default:
        break;
    }
    const params = {
      pageNum
    }
    const type = this.props.history.location.search.split(/[?=]/).pop()
    if (type) {
      params.type = type
    }
    axios.get(url, {
      params
    })
      .then(res => {
        const data = res.data.data
        this.setState({
          news: data,
          total: res.data.total
        })
      })
  }
  switchActive () {
    this.subTab.querySelectorAll('a').forEach(item => {
      item.onclick = (e) => {
        e.preventDefault()
        for (item of e.target.parentNode.children) {
          item.classList.remove('active')
        }
        e.target.classList.add('active')
      }
    })
  }
  goArticle (e) {
    this.props.history.push('/article/' + e.target.closest('.item').getAttribute('data-article-id'))
  }
  likehandler (e, arId) {
    // 禁止冒泡
    e.stopPropagation()
    if (this.props.loginState === 0) {
      alert('请先登录')
      this.props.history.push('/login')
      return false
    }
    // 视图层逻辑
    let likeBtn = e.target.closest('p')
    let likeState = likeBtn.classList.contains('active')
    let spanEL = likeBtn.querySelectorAll('span')[0]
    let count = spanEL.innerHTML

    if (likeState) {
      // 在ios safari中不兼容
      likeBtn.classList.remove('active')
      spanEL.innerHTML = --count
    } else {
      // 小动画
      likeBtn.classList.add('nicenice')
      setTimeout(() => {
        likeBtn.classList.toggle('nicenice')
      }, 500);

      likeBtn.classList.add('active')
      spanEL.innerHTML = ++count
    }

    axios.post(`${BASE_URL}/api/v2/like`, {
      arId,
      uId: this.props.userInfo.id,
      state: likeState ? 0 : 1
    })
      .then(res => {
      })
  }
  // 重写antd导航样式
  itemRender (current, type, originalElement) {
    if (type === 'prev') {
      return <a onClick={(e) => e.preventDefault()} href='/'>❮</a>;
    }
    if (type === 'next') {
      return <a onClick={(e) => e.preventDefault()} href='/'>❯</a>;
    }
    return originalElement;
  }
  reArticle () {
    this.getAllArticle(arguments[0], this.state.nowType)
  }
  render () {
    return (
      <div id='Main'>
        <div className='box'>
          <div id='Cell' className='subTab' ref={div => { this.subTab = div }}>
            <a href='/' onClick={() => this.getAllArticle(1, 2)} className='active'>热门</a>
            <a href='/' onClick={() => this.getAllArticle(1, 1)}>最新</a>
          </div>
          {
            this.state.news.map((item, index) => {
              return (
                <div data-article-id={item.id} onClick={(e) => this.goArticle(e)} ref={div => this.vLink = div} to='/login' className='cell item' key={index}>
                  <a onClick={(e) => { e.stopPropagation() }} href={'/member/' + item.author}>
                    <img width='48' height='48' className='avatar' alt='' src={item.avatar} />
                  </a>
                  <div className='itemContent'>
                    <a href={'/article/' + item.id}>{item.title}</a>
                    <p><i className='node'>{item.tags}</i>&nbsp;·&nbsp;<strong><a href='/'>{item.author}</a></strong>&nbsp;·&nbsp;{item.howLongAgo}</p>
                  </div>
                  <div className='countsBox'>
                    <p className={this.props.loginState === 1 && item.Love.includes(this.props.userInfo.id) ? 'active' : ''} onClick={(e) => this.likehandler(e, item.id)}><i className='iconfont'>&#xe668;</i><span>{item.niceCount}</span></p>
                    <p><i className='iconfont'>&#xe884;</i><span>{item.commentsCount}</span></p>
                  </div>
                </div>
              )
            })
          }
          {
            this.state.total ? <Pagination onChange={this.reArticle} itemRender={this.itemRender.bind(this)} className='myPagination' size='small' total={this.state.total} pageSize={10} /> : null
          }
        </div>
      </div>
    );
  }
}
const mapStates = state => {
  return {
    loginState: state.loginState,
    userInfo: state.userInfo
  }
}

export default connect(mapStates)(Main);