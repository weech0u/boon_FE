import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Input, Form, Button, Checkbox } from 'antd'
import axios from 'axios'

import './register.less'

const Layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 0 },
}

const buttonStyle = {
  width: '50%'
}

const onFinishFailed = errorInfo => {
  // console.log('Failed:', errorInfo);
};

class Register extends Component {
  async onFinish(values) {
    await axios.post('http://localhost:3001/api/v2/register', {...values})
    .then(res=> {
      console.log(res)
    })
  }
  render() {
    return (  
      <div className='registerWrapper'>
        <div className='register'>
          <div className='title'>

          </div>
          <div className='content' style={{'textAlign': 'center'}}>
            <Form
              {...Layout}
              name="basic"
              initialValues={{ remember: true }}
              autoComplete='off'
              onFinish={this.onFinish.bind(this)}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="电子邮箱"
                name="email"
                rules={[
                  { required: true, message: '请输入您的用户名(邮箱)!' },
                  { type: 'email', message: '邮箱格式不正确'}
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  { required: true, message: '请输入您的密码!' },
                  { min: 8, message: '密码不可少于8位' }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item 
                {...tailLayout} 
                name="remember" 
                valuePropName="checked"
                rules={[{ required: true, message: '您未同意《》' }]}
              >
                <Checkbox>我已阅读《》并同意</Checkbox>
              </Form.Item>
              <Button type="primary" htmlType="submit" style={{...buttonStyle}}>
                注册
              </Button>
            </Form>
          </div>
          <div className='tips'>

          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Register);