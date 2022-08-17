<template>
	<block>
		<view class="title">听我想听</view>
		<view class="message">注：本小程序使用网易云接口，请使用网易云账号登录</view>
		<view class="left-bar">LOGIN</view>
		<view class="input-content">
			<input type="text" class="inputItem" placeholder="请输入手机号码" v-model="phone">
			<input type="password" class="inputItem" placeholder="请输入密码" v-model="password">
		</view>
		<button class="confirm-login" @click="login()">登录</button>
	</block>
</template>

<script>
	export default {
		data() {
			return ({
				phone: '',
				password: ''
			})
		},
		methods: {
			async login() {
				if (!this.phone) {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return
				}
				let phoneReg = /^1[3-9]\d{9}$/
				if (!phoneReg.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}
				if (!this.password) {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					})
					return
				}
				let passwordReg = /^[A-Za-z0-9]+$/
				if (!passwordReg.test(this.password)) {
					uni.showToast({
						title: "密码格式错误！必须包含数字和字母",
						icon: 'none'
					})
					return
				}
				await uni.request({
					url: `http://localhost:4000/login/cellphone?phone=${this.phone}&password=${this.password}`,
					method: 'GET',
					success(res) {
						if (res.data.code == 200) {
							uni.showToast({
								title: '登录成功',
							})
							uni.setStorageSync("cookie", res.cookies)
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/music/music'
								})
							}, 2000)

						} else {
							uni.showToast({
								title: '登录失败,登录接口可能出现问题，使用备用账号跳转',
								icon: "error"
							})
							uni.setStorageSync("cookie", [
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/weapi/clientlog;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/weapi/clientlog;",
								"__csrf=89f653bbafe0a7d5ec781640b6c9465d; Max-Age=1296010; Expires=Thu 04 Aug 2022 06:37:42 GMT; Path=/;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/eapi/feedback;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/weapi/feedback;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/eapi/clientlog;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/eapi/feedback;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/openapi/clientlog;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/neapi/feedback;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/neapi/clientlog;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/api/feedback;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/weapi/feedback;",
								"MUSIC_U=3a27c9b80fb4333562cb2a1de29d0391d8af316413b678ac99a59b4687390102993166e004087dd3ebde80d994c48ffd24d12b7febeb22d149edc45b874e170729d78845b812c2c27a561ba977ae766d; Max-Age=1296000; Expires=Thu 04 Aug 2022 06:37:32 GMT; Path=/;",
								"MUSIC_SNS=; Max-Age=0; Expires=Wed 20 Jul 2022 06:37:32 GMT; Path=/",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/api/clientlog;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/eapi/clientlog;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/wapi/feedback;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/neapi/clientlog;",
								"NMTID=00OvoYESteQmRoIMkx9hMtizYAhWs8AAAGCGlNwNw; Max-Age=315360000; Expires=Sat 17 Jul 2032 06:37:32 GMT; Path=/;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/api/feedback;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/wapi/clientlog;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/neapi/feedback;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/api/clientlog;",
								"MUSIC_A_T=1657611922021; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/openapi/clientlog;",
								"__remember_me=true; Max-Age=1296000; Expires=Thu 04 Aug 2022 06:37:32 GMT; Path=/;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/wapi/clientlog;",
								"MUSIC_R_T=1657611922192; Max-Age=2147483647; Expires=Mon 07 Aug 2090 09:51:39 GMT; Path=/wapi/feedback;"
							])
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/music/music'
								})
							}, 2000)
						}
					}
				})

			}
		}
	}
</script>

<style>
	.title {
		position: relative;
		top: 80rpx;
		text-align: center;
		font-size: 50rpx;
		color: #34d8a4;
		font-weight: 1000;
	}

	.message {
		position: relative;
		top: 130rpx;
		font-size: 26rpx;
		color: #808080;
		text-align: center;
	}


	.left-bar {
		position: relative;
		top: 170rpx;
		color: #646155;
		font-size: 80rpx;
		left: 40rpx;
	}

	.input-content {
		position: relative;
		top: 180rpx;
		display: flex;
		flex-direction: column;
	}

	.confirm-login {
		position: relative;
		top: 230rpx;
		width: 400rpx;
		font-size: 32rpx;
		font-weight: 1000;
		color: #ffffff;
		background-color: #34d8a4;
		border-radius: 50rpx;
	}

	input {
		position: relative;
		left: 0;
		right: 0;
		margin: 20rpx auto;
		font-size: 30rpx;
		height: 80rpx;
		width: 500rpx;
		background-color: #ffffff;
		border-radius: 8rpx;
		padding-left: 30rpx;
	}
</style>
