async function executeLoggingAndRedirect(reason) {
  await logToDiscord("redirect", reason);
  executeRedirect(reason);
}


async function redirectSuspiciousAccess() {
  // リファラをチェック（あれば即終了、なければ検閲続行）
  // 友好的ボットを確認
  // E2Eライブラリ有無を確認
  // 友好的ボットでE2Eライブラリ無しであれば、即終了
  if (USER_REFERRER || (isFriendlyBot() && !isE2Etest())) {
    return false;
  }
  else{
    // リファラのないアクセスを記録
    await logToDiscord("record", "no referrer");
  }

  // デバイス名が不明かチェック（不明ならリダイレクト、そうでなければ次の検閲へ）
  if (isUnknownDevice()) {
    await executeLoggingAndRedirect("unknown device");
    return true;
  }

  // 解像度をチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isInappropriateResolution()){
    await executeLoggingAndRedirect("resolution");
    return true;
  }

  // timezoneをチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isProhibitedTimezone()){
    await executeLoggingAndRedirect("timezone");
    return true;
  }

  // 360 secure browserの検出　(検出ならリダイレクト、そうでなければ次の検閲へ）
  if (is360()){
    await executeLoggingAndRedirect("360");
    return true;
  }

  // 特定の組合せのプラットフォームをチェック（対象ならリダイレクト、そうでなければ即終了）
  if (isProhibitedEnvironment()) {
    await executeLoggingAndRedirect("environment");
    return true;
  }

  // すべての検問を潜り抜けたものだけがアクセス許可
  return false;
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

await redirectSuspiciousAccess();
