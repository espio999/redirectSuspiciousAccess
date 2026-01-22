
function isApple(){
  // Apple製品
  const categories = ["Mac OS", "OS X", "iOS"];

  // Apple製品特性の正規表現
  const reg_mac = /\bMac OS\b/;
  const reg_osx = /\bOS X\b/;
  const reg_ios = /iOS/i;

  const categoryIndex = [reg_mac, reg_osx, reg_ios].findIndex(reg => reg.test(USER_OS));
  
  return categories[categoryIndex] ?? null;
}


function isLinux(){
  const my_reg = /Linux|Ubuntu|Debian|Fedora|Red Hat|SuSE|CentOS|Gentoo/i;

  // Linux、あるいはライブラリが Linux ディストリビューションとして認識しているか
  // AndroidもLinuxカーネルなので、除外する判定
  return !!(USER_OS && my_reg.test(USER_OS) && !/Android/i.test(USER_OS));
}


function isChrome(){
  const my_reg = /Chrome/i;
  return !!(USER_BROWSER && my_reg.test(USER_BROWSER));
}


function isFirefox(){
  const my_reg = /Firefox/i;
  return !!(USER_BROWSER && my_reg.test(USER_BROWSER));
}


function getBrowserFamily(){
  const categories = ["Chrome", "Firefox", "Safari"];

  const reg_chrome = /Chrome/i;
  const reg_firefox = /Firefox/i;
  const reg_safari = /Safari/i;

  const categoryIndex = [reg_chrome, reg_firefox, reg_safari].findIndex(reg => reg.test(USER_BROWSER));
  
  return categories[categoryIndex] ?? null;
}


async function executeLoggingAndRedirect(reason) {
  await logToDiscord("redirect", reason);
  executeRedirect(reason);
}


function isProhibitedEnvironment() {
  // OS、ブラウザ、スクリーン解像度の組合せを保持しておく
  // 検閲対象リスト
  const prohibitedCombinations = [
    { os: '', browser: 'Chrome', width: 412, height: 915 },
    { os: 'Android', browser: 'Chrome', width: 375, height: 812 },
    { os: 'Android', browser: 'Chrome', width: 393, height: 873 },
    { os: 'Linux', browser: 'Firefox', width: 1200, height: 1920 },
    { os: 'Linux', browser: 'Chrome', width: 1280, height: 720 },
    { os: 'Linux', browser: 'Chrome', width: 1280, height: 800 },
    { os: 'Linux', browser: 'Firefox', width: 1671, height: 1114 },
    { os: 'Mac OS', browser: 'Chrome', width: 800, height: 600 },
    { os: 'Mac OS', browser: 'Chrome', width: 1920, height: 1080 },
    { os: 'OS X', browser: 'Chrome', width: 800, height: 600 },
    { os: 'OS X', browser: 'Chrome', width: 1920, height: 1080 },
    { os: 'iOS', browser: '', width: 375, height: 812 },
    { os: 'iOS', browser: 'Chrome', width: 800, height: 600 },
    { os: 'iOS', browser: 'Safari', width: 390, height: 844 },
    { os: 'Windows', browser: 'Chrome', width: 1200, height: 3000 },
    { os: 'Windows', browser: 'Chrome', width: 1200, height: 1280 },
    { os: 'Windows', browser: 'Chrome', width: 1280, height: 1200 },
    { os: 'Windows', browser: 'Chrome', width: 1366, height: 768 },
    { os: 'Windows', browser: 'Firefox', width: 1600, height: 900 }
  ];

  // Linuxの特定
  let currentOS = USER_OS;
  currentOS = (isLinux()) ? "Linux" : currentOS;

  //Apple製品の特定
  let ret_isApple = isApple();
  currentOS = ret_isApple ?? currentOS;

  //ブラウザの特定
  let currentBrowser = USER_BROWSER;
  let ret_getBrowserFamily = getBrowserFamily();
  currentBrowser = ret_getBrowserFamily ?? currentBrowser;
  /*
  //Chrome, Firefoxの特定
  currentBrowser = (isChrome()) ? "Chrome" : currentBrowser;
  currentBrowser = (isFirefox()) ? "Firefox" : currentBrowser;
  */

  // 判定した値の組合せが、あらかじめ保持していた組合せに含まれるかを確認する
  // Array.prototype.some() は、条件に一致する要素が一つでもあれば true を返す
  const isMatchedEnvironment = prohibitedCombinations.some(config => {
    return config.os === currentOS &&
      config.browser === USER_BROWSER &&
      config.width === SCREEN_WIDTH &&
      config.height === SCREEN_HEIGHT;
  });

  // 国が許可されているか（許可なら true）
  const isApprovedCountry = (() => {
    const APPROVED_COUNTRIES = ["Japan"];
    return APPROVED_COUNTRIES.includes(USER_COUNTRY);
  })();

  // 「特定の環境」かつ「許可されていない国」であれば true（禁止）を返す
  return isMatchedEnvironment && !isApprovedCountry;
}


function isProhibitedTimezone(){
  const prohibited_countries = ["Angola", "China", "Hong Kong", "Singapore"];

  return USER_COUNTRY === null || prohibited_countries.includes(USER_COUNTRY);
}


function isInappropriateResolution(){
  //検閲対象解像度
  const target_resolution = new Set([
    "0,0",
    //"375,812","812,375",
    "517,826","826,517",
    //"800,600"
    //"1280,720",
    //"1280,800",
    "1200,3000",
    "1200,1280",
    "1280,1200",
    "1366,1366",
    "1600,1600",
  ]);

  const my_pair = [SCREEN_WIDTH, SCREEN_HEIGHT];

  //検閲対象の解像度ならば、trueを返す。
  return target_resolution.has(my_pair.join(','));
}


function isUnknownDevice(){
  // ブラウザ、OSが不明か判定
  //!null-->true
  const isNull_browser = !USER_BROWSER;
  const isNull_os = !USER_OS;

  //ブラウザ、OSの一方が不明ならtrueを返す。
  return isNull_browser || isNull_os;
}


function isE2Etest(){
  //E2Eテストライブラリのオブジェクトを確認
  //一つでもロードされているとtruthy→一つ目の!でfalse、二つ目の!でtrue
  //一つもロードされていないとfalse →一つ目の!でtrue、二つ目の!でfalse
  const isBot = !!(
    window.__nightmare || 
    navigator.webdriver || 
    window.Cypress || 
    window._phantom
  );

  //言語設定されていない状況を判定
  const hasNoLanguage = !!(navigator.languages && navigator.languages.length === 0);

  return (isBot || hasNoLanguage);
}


function isFriendlyBot(){
  const bot_list = [
    'Googlebot',            // Google
    'bingbot',              // Bing / Microsoft Ads
    'Applebot',             // Apple (Siri/Spotlight)
    'DuckDuckBot',          // DuckDuckGo
    'Y!J-',                 // Yahoo! JAPAN (独自の巡回ボット)
    //'Baiduspider',          // Baidu (中国最大手)
    //'YandexBot',            // Yandex (ロシア最大手)
    //'facebookexternalhit',  // Facebookのリンクプレビュー
    'Slackbot',             // Slackのリンク展開
    'Twitterbot',           // X (Twitter) のリンク展開
    //'PerplexityBot'         // AI検索 (Perplexity)
  ];

  const reg_bot = new RegExp(bot_list.join('|'), 'i');
  return reg_bot.test(window.document.userAgent);
}


async function redirectSuspiciousAccess() {
  // リファラをチェック（あれば即終了、なければ検閲続行）
  // 友好的ボットを確認
  // E2Eライブラリ有無を確認
  // 友好的ボットでE2Eライブラリ無しであれば、即終了
  if (USER_REFERRER || (isFriendlyBot() && !isE2Etest())) {
    return;
  }
  else{
    // リファラのないアクセスを記録
    await logToDiscord("record", "no referrer");
  }

  // デバイス名が不明かチェック（不明ならリダイレクト、そうでなければ次の検閲へ）
  if (isUnknownDevice()) {
    executeLoggingAndRedirect("unknown device");
    return;
  }

  // 解像度をチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isInappropriateResolution()){
    executeLoggingAndRedirect("resolution");
    return;
  }

  // timezoneをチェック（対象ならリダイレクト、そうでなければ次の検閲へ）
  if (isProhibitedTimezone()){
    executeLoggingAndRedirect("timezone");
  }

  // 特定の組合せのプラットフォームをチェック（対象ならリダイレクト、そうでなければ即終了）
  if (isProhibitedEnvironment()) {
    executeLoggingAndRedirect("environment");
    return;
  }

  // すべての検問を潜り抜けたものだけがアクセス許可
  return;
}

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

redirectSuspiciousAccess();
