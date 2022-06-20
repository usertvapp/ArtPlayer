var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginAds({
            // html广告，假如存在视频广告则忽略该值
            html: '123456',

            // 视频广告
            video: '',

            // 广告跳转网址，为空则不跳转
            url: 'http://artplayer.org',

            // 必须观看的时长，期间不能被跳过
            playDuration: 0,

            // 广告总时长，假如是视频广告则自动获取
            totalDuration: 0,

            // 是否允许广告全屏
            fullscreen: true,

            // 是否允许视频广告静音
            muted: true,

            // 多语言支持
            i18n: {
                //
            },
        }),
    ],
});

// 广告被点击
art.on('artplayerPluginAds:click', (ads) => {
    console.info('广告被点击', ads);
});

// 广告被跳过
art.on('artplayerPluginAds:skip', (ads) => {
    console.info('广告被跳过', ads);
});