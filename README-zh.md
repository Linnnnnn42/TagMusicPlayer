# 标签音乐

一个基于标签的音乐播放器，使用 React Native 和 Expo 构建

其他语言版本: [English](README.md), [中文](README-zh.md).

## 功能

### 音乐播放
- 音频播放控制：包括播放、暂停、切换歌曲和定位
- 支持后台音频播放

### 音乐库管理
- 自动扫描和整理音乐库
- 按标题、艺术家或歌词搜索和筛选功能
- 基于标签的音乐分类

### 用户界面
- 基于专辑封面的动态色彩主题
- 底部弹出式播放器界面
- 浮动播放器

### 本地化
- 多语言支持（英语和中文）

## 待办事项
### 功能/重构
- 减少闪烁
- 封装并使用 cpp 语言 taglib 库提高读取效率
- 启动屏幕，更详细的加载提示
- 键盘处理
    - 移动搜索按钮位置，使搜索栏出现时可见
- 用 SegmentedButtons 替换搜索过滤器 Checkbox 组件
- 更好的纯音乐判定
- 切换歌曲时的震动反馈
- 歌曲间淡入淡出
- 完整的无障碍支持
### 已知 bug
- 无法读取包含非法字符如 ? # / [] {} 空格的文件

## 构建 APK

要为 Android 构建 APK，请按照以下步骤操作：
1. 按照以下指南配置您的 Android 开发环境：
   [Expo Android 设置指南](https://docs.expo.dev/workflow/android-studio-emulator/)，
   [设置您的环境](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local)

2. 确保已安装所有依赖项：
```shell
   cd ./music-app
   npm install
```

3. 按照以下指南生成您的密钥：
   [React Native: Signed apk android](https://reactnative.dev/docs/signed-apk-android)

4. 预构建：
```shell
cd ./music-app
npx expo prebuild --platform android
```

5. 配置图标/启动屏幕资源（详见 [react-native-bootsplash: setup](https://github.com/zoontek/react-native-bootsplash?tab=readme-ov-file#setup)）：
```shell
cd ./music-app
npx react-native-bootsplash generate svgs/light-logo.svg ` 
--platforms=android,ios,web` 
--background=F5FCFF` --logo-width=100` 
--assets-output=assets/bootsplash ` 
--flavor=main` 
--html=public/index.html
```

6. 构建 APK：
```shell
cd ./music-app/android
./gradlew assembleRelease
```

7. 获取输出的 apk: app-release.apk
```shell
cd ./music-app/android/app/build/outputs/apk/release/
explorer .
```

## 致谢
本项目使用了许多优秀的开源库和工具：

- [Babel](https://babeljs.io/) - JS 编译器
- [Expo](https://expo.dev/) - 让 React Native 开发更简单的平台
- [Gorhom Bottom Sheet](https://github.com/gorhom/react-native-bottom-sheet) - 功能丰富的底部弹出组件
- [i18next](https://www.i18next.com/) - 本地化框架
- [Music Metadata](https://github.com/Borewit/music-metadata) - 解析音频文件的元数据
- [Object Hash](https://github.com/puleos/object-hash) - 在 node 和浏览器中从 javascript 对象生成哈希值
- [Prettier](https://prettier.io/) - 代码格式化工具
- [React](https://github.com/facebook/react) - React Native 的核心库
- [React Native](https://reactnative.dev/) - 构建移动应用的核心框架
- [React Native Awesome Slider](https://github.com/alantoa/react-native-awesome-slider) - 可定制的滑块组件
- [React Native Bootsplash](https://github.com/zoontek/react-native-bootsplash) - React Native 应用的启动屏幕
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - 原生支持的手势管理 API
- [React Native Image Colors](https://github.com/osamaqarem/react-native-image-colors) - 从图像中获取主要颜色
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) - 高效、轻量级的移动端键值存储框架
- [React Native Paper](https://callstack.github.io/react-native-paper/) - React Native 的 Material Design 组件
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - React Native Animated 库的重新实现
- [React Native Safe Area Context](https://github.com/AppAndFlow/react-native-safe-area-context) - 处理安全区域插入的模块
- [React Native Text Ticker](https://github.com/deanhet/react-native-text-ticker) - React Native 的文本自动滚动组件
- [Typescript](https://www.typescriptlang.org/) - 带有类型语法的 JS

## 许可证

本项目采用 MIT 许可证
