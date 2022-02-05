function imgToBase64(file, callback) {
  if (!file) {
    callback('');
    return;
  }
  // 声明js的文件流
  const reader = new FileReader();
  // 通过文件流将文件转换成Base64字符串
  reader.readAsDataURL(file);
  // 转换成功后
  reader.onloadend = function () {
    // 输出结果
    return callback(reader.result);
  };
}

export { imgToBase64 };
