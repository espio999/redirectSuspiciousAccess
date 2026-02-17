async function executeLoggingAndRedirect() {
  await logToDiscord();
  executeRedirect();
}


async function redirectSuspiciousAccess() {
  // リファラをチェック（あれば即終了、なければ検閲続行）
  // 友好的ボットを確認
  // E2Eライブラリ有無を確認
  // 友好的ボットでE2Eライブラリ無しであれば、即終了
  //if (USER_REFERRER || (isFriendlyBot() && !isE2Etest())) {
  if (!window.FLAG_MAP.isNoReferrer || window.FLAG_MAP.isFriendlyBot) {
    return false;
  }
  else{
    // リファラのないアクセスを記録
    window.FLAG_MAP.reason = "no referrer";
    window.FLAG_MAP.log_mode = "record";
    await logToDiscord();
  }

  // デバイス名が不明かチェック（不明ならリダイレクト、そうでなければ次の検閲へ）
  if (isUnknownDevice()) {
    window.FLAG_MAP.reason = "unknown device";
    window.FLAG_MAP.log_mode = "redirect";
    await executeLoggingAndRedirect();
    return true;
  }

  // 解像度をチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isInappropriateResolution()){
    window.FLAG_MAP.reason = "resolution";
    window.FLAG_MAP.log_mode = "redirect";
    await executeLoggingAndRedirect();
    return true;
  }

  // timezoneをチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isProhibitedTimezone()){
    window.FLAG_MAP.reason = "timezone";
    window.FLAG_MAP.log_mode = "redirect";
    await executeLoggingAndRedirect();
    return true;
  }

  // 360 secure browserの検出　(検出ならリダイレクト、そうでなければ次の検閲へ）
  /*
  if (is360()){
    await executeLoggingAndRedirect("360");
    return true;
  }
  */

  // 特定の組合せのプラットフォームをチェック（対象ならリダイレクト、そうでなければ即終了）
  if (isProhibitedEnvironment()) {
    window.FLAG_MAP.reason = "environment";
    window.FLAG_MAP.log_mode = "redirect";
    await executeLoggingAndRedirect();
    return true;
  }

  // すべての検問を潜り抜けたものだけがアクセス許可
  return false;
}

function isRedirected(){
  const url_param = new URLSearchParams(window.location.search);
  return !!url_param.get('expected');
}

const UA = navigator.userAgent;
const USER_REFERRER = document.referrer;
const USER_COUNTRY = getCountry();

//OS
const USER_OS = platform.os ? platform.os.family : "";
const USER_BROWSER = platform.name;

//解像度
// サーバーサイドなら 0、ブラウザなら実際の幅を入れる
const is_undefined = (typeof window === 'undefined' || typeof screen === 'undefined') ? true : false;
const SCREEN_WIDTH = (is_undefined) ? 0 : screen.width;
const SCREEN_HEIGHT = (is_undefined) ? 0 : screen.height;

window.FLAG_MAP = window.FLAG_MAP || {
  isInlineExecuted: false,
  isMainExecuted: false,
  isFriendlyBot: (isFriendlyBot() && !isE2Etest()),
  isNoReferrer: !USER_REFERRER,
  isRedirected: isRedirected(),
  reason: "",
  log_mode: "",
}

window.FLAG_MAP.isMainExecuted = true;
console.log(`window.FLAG_MAP.isInlineExecuted, window.FLAG_MAP.isMainExecuted, window.FLAG_MAP.isRedirected = ${window.FLAG_MAP.isInlineExecuted}, ${window.FLAG_MAP.isMainExecuted}, ${window.FLAG_MAP.isRedirected}`)
if (!window.FLAG_MAP.isInlineExecuted) redirectSuspiciousAccess();
