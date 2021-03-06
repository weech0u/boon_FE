/*
 * @Description: 
 * @Version: 1.0
 * @Autor: zhou wei
 * @Date: 2020-09-24 15:19:42
 * @LastEditors: zhou wei
 * @LastEditTime: 2021-02-19 13:40:30
 */
import axios from 'axios';
import {BASE_URL} from '../../base'
import React, { Component } from 'react';
import { connect } from 'react-redux'
import localStorage from 'redux-persist/es/storage';
import { RESET_USER_STATE } from '../../store/constants'

import Me from '../../components/me'
import Main from '../../components/main'
import Hotheme from '../../components/hotheme'
import UnLoginMe from '../../components/unLoginMe'

import './home.less'

class Home extends Component {
  componentDidMount() {
    localStorage.getItem('persist:root')
    .then(res=> {
      const token = this.props.token
      return axios.post(`${BASE_URL}/api/v2/tokenVerify`,{},{
        headers:{
          'Authorization': 'Basic ' + token
        }
      })
    })
    .then(res=> {
      const data = res.data
      if (data.code !== 200) {
        this.props.handleSetUserState(0, '') 
      }
    })
  }
  render() { 
    const styles = {'height': '1px','margin': '20px 0','boxShadow': '0 0 3px rgba(0, 0, 0, .2)'}
    return (  
      <>
        <div className='sep40'></div>
        <div id="rightBar">
          {
            this.props.loginState === 1?
            <Me {...this.props} />
            :
            <UnLoginMe />
          }

          {
            this.props.loginState === 1?
            <>
              <div className='sep20'></div>
              <div className='inner reward'>
                <i className='iconfont'>&#xeb7e;</i>
                &nbsp;&nbsp;领取今日的登录奖励
              </div>
              <div style={styles}></div>
              <div className='inner'>
                <span>我收藏的主题</span>
              </div>
            </>
            :
            null
          }

          <Hotheme />

          {/* <Hotnode /> */}

          {/* <Community /> */}
        </div>

        {/* 因为浮动特性, 需要将main放在浮动元素后面 */}
        {/* 子组件的props需要由父组件传入 */}
        <Main {...this.props}/>
      </>
    );
  }
}
const mapStates = state => {
  return {
    loginState: state.loginState,
    token: state.token
  }
}

const mapDispatchs = dispatch => {
  return {
    handleSetUserState(loginState, token) {
      dispatch({type: RESET_USER_STATE, loginState, token})
    }
  }
}

export default connect(mapStates, mapDispatchs)(Home);