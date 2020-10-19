<template>
    <div class="login">
        <van-form @submit="onSubmit">
            <van-field v-model="form.username" label-width="60px" name="username" label-align="right" label="邮箱："
                :rules="[{ required: true, message: '请填写邮箱' }]" />
            <van-field v-model="form.password" label-width="60px" name="password" label-align="right" type="password"
                label="密   码：" :rules="[{ required: true, message: '请填写密码' }]" />
            <div style="margin: 16px;">
                <van-button round block type="default" @click="login" native-type="submit">
                    一键登录
                </van-button>
            </div>
        </van-form>
    </div>
</template>


<script>
    import { Toast } from 'vant';
	import Vue from 'vue';
    import { Form } from 'vant';
    import { mapActions } from 'vuex'
    export default {
        data() {
            return {
                form: {
                    username: "",
                    password: ""
                }
            }
        },
        methods: {
            ...mapActions(['changeLoginStatus']),
            onSubmit(values) {
                console.log('submit', values);
            },
            login() {
                this.$http.login(this.form).then(res => {
                    console.log(res.data)
                    if (res.data.code !== 200) return Toast.fail(res.data.message)
                    let info = res.data;
                    let data = {
                        token: info.token,
                        id: info.account.id,
                        profile: info.profile
                    }

                    window.sessionStorage.setItem('userInfo', JSON.stringify(data))
                    this.getUserInfo()
                    this.changeLoginStatus(true)
                    this.$router.push('/recommend')
                })
            },
            getUserInfo() {
                this.$http.userInfo().then(res => {
                    console.log(res)
                })
            }
        },
    }
</script>


<style scoped>
    .login {
        background-color: #c62f2f;
        padding: 50% 10%;
        height: 100%;
    }


    .van-button {
        color: #c62f2f;
        letter-spacing: 2px;
    }

    .van-cell {
        background-color: transparent;
        color: #fff;
    }

    .van-field__label {
        width: 60px;
    }

    .van-field__body input {
        color: #fff;
        outline: 0;
        border: none;
        background-color: transparent !important;
    }

    input {
        background-color: transparent;
    }
</style>