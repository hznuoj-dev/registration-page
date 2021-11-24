import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import api from '@/api';

import style from './index.module.less';

import { Form, Input, Button, message, Row, Col, Select } from 'antd';
import { MailOutlined, SafetyOutlined } from '@ant-design/icons';
const { Option } = Select;

import { Loading } from '@/components/Loading';

import { useAuthToken } from '@/utils/hooks';
import { isValidEmail } from '@/utils/validators';

import { isEmail } from 'class-validator';

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay || 0));

interface LoginFormProps {
  email: string;
  emailVerificationCode: string;
}

interface SubmitFormProps {
  email: string;
  name: string;
  organization: number;
}

enum PageState {
  Loading,
  LoggedIn,
  NotLoggedIn,
}

const IndexPage: React.FC<{}> = () => {
  const { getToken, signIn } = useAuthToken();

  const { initialState, refresh } = useModel('@@initialState');

  const [pageState, setPageState] = useState(PageState.Loading);

  const [loginForm] = Form.useForm();
  const [registrationForm] = Form.useForm();

  const [
    SendEmailVerificationCodeLoading,
    setSendEmailVerificationCodeLoading,
  ] = useState(false);
  const [loginBtnLoading, setLoginBtnLoading] = useState(false);
  const [logoutBtnLoading, setLogoutBtnLoading] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);

  const [organizationList, setOrganizationList] = useState(
    [] as ApiTypes.RegistrationOrganizationEntity[],
  );

  useEffect((): void => {
    if (getToken().length > 0) {
      getRegistration();
    } else {
      setPageState(PageState.NotLoggedIn);
    }
  }, []);

  async function getRegistration(email: string = '') {
    {
      const { requestError, response } =
        await api.registration.getRegistration();
      if (requestError) {
        message.error(requestError);
        return;
      } else if (response?.error) {
        if (response?.error === 'PERMISSION_DENIED') {
          message.error(response?.error);
          return;
        }
      }

      registrationForm.setFieldsValue({
        email:
          response?.registrationMeta?.email ??
          initialState?.userMeta?.email ??
          email,
        name: response?.registrationMeta?.name ?? '',
        organization: response?.registrationMeta?.organizationId ?? 1,
        approveState: response?.registrationMeta?.approveState ?? 'Pending',
      });
    }

    {
      const { requestError, response } =
        await api.registration.getOrganizationList();
      if (requestError) {
        message.error(requestError);
        return;
      }

      setOrganizationList(
        response?.registrationMetaList as ApiTypes.RegistrationOrganizationEntity[],
      );
    }

    setPageState(PageState.LoggedIn);
  }

  async function sendEmailVerificationCode() {
    const email = loginForm.getFieldValue('email');

    if (!isValidEmail(email)) {
      message.error('invalid Email!');
      return;
    }

    setSendEmailVerificationCodeLoading(true);
    const { requestError, response } = await api.auth.sendEmailVerificationCode(
      {
        email,
        type: 'Login',
        locale: 'en_US',
      },
    );

    if (requestError) {
      message.error('Sent failed, please try agein.');
    } else if (response?.error) {
      if (response?.error === 'RATE_LIMITED') {
        message.warning('Sent too frequently!');
      } else {
        message.warning('Sent failed!');
      }
    } else {
      message.success('Sent successfully!');
    }

    setSendEmailVerificationCodeLoading(false);
  }

  async function loginAction(formProps: LoginFormProps) {
    if (!isEmail(formProps.email)) {
      message.error('invalid Email!');
      return;
    }

    const { requestError, response } = await api.auth.login({
      email: formProps.email,
      emailVerificationCode: formProps.emailVerificationCode,
    });

    if (requestError) {
      message.error(requestError);
    } else if (response?.error) {
      message.error(response.error);
    } else if (response?.token) {
      signIn(response.token);
      await refresh();
      await getRegistration(formProps.email);
      message.success('Login Successfully!');
    }
  }

  async function onLogin(formProps: LoginFormProps) {
    setLoginBtnLoading(true);
    await loginAction(formProps);
    setLoginBtnLoading(false);
  }

  async function logoutAction() {
    const { requestError } = await api.auth.logout();

    if (requestError) {
      message.error(requestError);
      return;
    }

    message.success('Logout Successfully!');
    setPageState(PageState.NotLoggedIn);
  }

  async function onLogout() {
    setLogoutBtnLoading(true);
    await logoutAction();
    setLogoutBtnLoading(false);
  }

  async function submitAction(formProps: SubmitFormProps) {
    const { requestError, response } = await api.registration.registration({
      name: formProps.name,
      organizationId: formProps.organization,
    });

    if (requestError) {
      message.error(requestError);
    } else if (response?.error) {
      message.error(response?.error);
    } else {
      await getRegistration();
      message.success('Submitted Successfully!');
    }
  }

  async function onSubmit(formProps: SubmitFormProps) {
    setSubmitBtnLoading(true);
    await submitAction(formProps);
    setSubmitBtnLoading(false);
  }

  return (
    <>
      <div className={style.root}>
        <div className={style.secondRootforTitle}>
          <span className={style.title}>
            Hangzhou Normal U 4th Freshman Contest Registration
          </span>
        </div>
      </div>

      {pageState === PageState.Loading && (
        <div className={style.root}>
          <Loading></Loading>
        </div>
      )}

      {pageState === PageState.NotLoggedIn && (
        <div className={style.root}>
          <div className={style.secondRoot}>
            <Form
              layout="vertical"
              className={style.form}
              onFinish={onLogin}
              form={loginForm}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  type="email"
                  placeholder="E-mail"
                />
              </Form.Item>

              <Form.Item
                name="emailVerificationCode"
                rules={[
                  {
                    required: true,
                    message: 'Please input your E-mail Verify Code!',
                  },
                ]}
              >
                <Row gutter={[16, 0]}>
                  <Col span={15}>
                    <Input
                      prefix={
                        <SafetyOutlined className="site-form-item-icon" />
                      }
                      placeholder="E-mail Verify Code"
                    />
                  </Col>

                  <Col span={9}>
                    <Button
                      loading={SendEmailVerificationCodeLoading === true}
                      onClick={sendEmailVerificationCode}
                      type="primary"
                      className={style['form-button']}
                    >
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={loginBtnLoading === true}
                  type="primary"
                  htmlType="submit"
                  className={style['form-button']}
                >
                  Login/Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      {pageState === PageState.LoggedIn && (
        <div className={style.root}>
          <div className={style.secondRoot}>
            <Form
              layout="vertical"
              className={style.form}
              onFinish={onSubmit}
              form={registrationForm}
            >
              <Form.Item className={style['form-item']}>
                <Form.Item
                  name="email"
                  label="Email"
                  tooltip="Your registered email."
                >
                  <Input disabled={true} />
                </Form.Item>
              </Form.Item>

              <Form.Item className={style['form-item']}>
                <Form.Item
                  name="name"
                  label="Name"
                  tooltip="Your real name or team name."
                  rules={[
                    {
                      required: true,
                      message: 'Please input your name!',
                    },
                    {
                      type: 'string',
                      min: 2,
                      max: 16,
                      message: 'The length of name should be between 2-16',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item className={style['form-item']}>
                <Form.Item
                  name="organization"
                  label="Organization"
                  tooltip="Your organization."
                  rules={[
                    {
                      required: true,
                      message: 'Please select your organization!',
                    },
                  ]}
                >
                  <Select>
                    {organizationList.map((organization) => {
                      return (
                        <Option value={organization.id} key={organization.id}>
                          {organization.organizationName}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Form.Item>

              <Form.Item className={style['form-item']}>
                <Form.Item
                  name="approveState"
                  label="ApproveState"
                  tooltip="Your approve state"
                >
                  <div className={style['approve-state']}>
                    <span
                      className={
                        style[registrationForm.getFieldValue('approveState')]
                      }
                    >
                      {registrationForm.getFieldValue('approveState')}
                    </span>
                  </div>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={submitBtnLoading === true}
                  type="primary"
                  htmlType="submit"
                  className={style['form-button']}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>

            <div
              style={{
                marginTop: '-10px',
              }}
            >
              <Button
                loading={logoutBtnLoading === true}
                onClick={onLogout}
                type="primary"
                className={style['form-button']}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
