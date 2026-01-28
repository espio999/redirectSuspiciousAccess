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


/*function isChrome(){
  const my_reg = /Chrome/i;
  return !!(USER_BROWSER && my_reg.test(USER_BROWSER));
}


function isFirefox(){
  const my_reg = /Firefox/i;
  return !!(USER_BROWSER && my_reg.test(USER_BROWSER));
}*/


function getBrowserFamily(){
    const categories = ["Chrome", "Edge", "Firefox", "Opera", "Safari"];

    const reg_chrome = /Chrome/i;
    const reg_edge = /Edge/i;
    const reg_firefox = /Firefox/i;
    const reg_opera = /Opera/i;
    const reg_safari = /Safari/i;

    const categoryIndex = [reg_chrome, reg_edge, reg_firefox, reg_opera, reg_safari].findIndex(reg => reg.test(USER_BROWSER));

    return categories[categoryIndex] ?? null;
}


function isApprovedCountry(){
    // 国が許可されているか（許可なら true）
    const APPROVED_COUNTRIES = ["Japan"];
    return APPROVED_COUNTRIES.includes(USER_COUNTRY);
}


/*function isProhibitedEnvironment() {
  // OS、ブラウザ、スクリーン解像度の組合せを保持しておく
  // 検閲対象リスト
  const prohibitedCombinations = [
    { os: '', browser: 'Chrome', width: 412, height: 915 },
    { os: 'Android', browser: 'Chrome', width: 375, height: 812 },
    { os: 'Android', browser: 'Chrome', width: 393, height: 873 },
    { os: 'Android', browser: 'Chrome', width: 1080, height: 1920 }, { os: 'Android', browser: 'Chrome', width: 1920, height: 1080 },
    { os: 'Android', browser: 'Firefox', width: 432, height: 964 },
    { os: 'Android', browser: 'Firefox', width: 964, height: 432 },
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
    { os: 'iOS', browser: 'Safari', width: 375, height: 812 },
    { os: 'iOS', browser: 'Safari', width: 390, height: 844 },
    { os: 'Windows', browser: 'Chrome', width: 600, height: 800 }, { os: 'Windows', browser: 'Chrome', width: 800, height: 600 },
    { os: 'Windows', browser: 'Chrome', width: 993, height: 1905 }, { os: 'Windows', browser: 'Chrome', width: 1905, height: 993 },
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
  /!*
  //Chrome, Firefoxの特定
  currentBrowser = (isChrome()) ? "Chrome" : currentBrowser;
  currentBrowser = (isFirefox()) ? "Firefox" : currentBrowser;
  *!/

  // 判定した値の組合せが、あらかじめ保持していた組合せに含まれるかを確認する
  // Array.prototype.some() は、条件に一致する要素が一つでもあれば true を返す
  const isMatchedEnvironment = prohibitedCombinations.some(config => {
    return config.os === currentOS &&
      config.browser === currentBrowser &&
      config.width === SCREEN_WIDTH &&
      config.height === SCREEN_HEIGHT;
  });

  // 「特定の環境」かつ「許可されていない国」であれば true（禁止）を返す
  return isMatchedEnvironment && !isApprovedCountry();
}*/


function isProhibitedEnvironment() {
    // OS、ブラウザ、スクリーン解像度の組合せを保持しておく
    // 検閲対象リスト
    // フォーマット: "OS|Browser|Width|Height"
    const prohibited_combination = new Set([
        "|Chrome|412|915",
        "Android|Chrome|375|812",
        "Android|Chrome|393|873",
        "Android|Chrome|1080|1920",
        "Android|Chrome|1920|1080",
        "Android|Firefox|432|964",
        "Android|Firefox|964|432",
        "Linux|Firefox|1200|1920",
        "Linux|Chrome|1280|720",
        "Linux|Chrome|1280|800",
        "Linux|Firefox|1671|1114",
        "Mac OS|Chrome|800|600",
        "Mac OS|Chrome|1280|720",
        "Mac OS|Chrome|1920|1080",
        "OS X|Chrome|800|600",
        "OS X|Chrome|1920|1080",
        "iOS||375|812",
        "iOS|Chrome|800|600",
        "iOS|Safari|375|812",
        "iOS|Safari|390|844",
        "Windows|Chrome|600|800",
        "Windows|Chrome|800|600",
        "Windows|Chrome|993|1905",
        "Windows|Chrome|1905|993",
        "Windows|Chrome|1200|3000",
        "Windows|Chrome|1200|1280",
        "Windows|Chrome|1280|1200",
        "Windows|Chrome|1366|768",
        "Windows|Chrome|1366|1366",
        "Windows|Firefox|1600|900"
    ]);

    //Linuxの特定
    //Apple製品の特定
    let current_os = USER_OS;
    current_os = (isLinux()) ? "Linux" : current_os;
    current_os = (isApple()) ?? current_os;

    //ブラウザの特定
    let current_browser = USER_BROWSER;
    current_browser = getBrowserFamily() ?? current_browser;

    const matching_key = `${current_os}|${current_browser}|${SCREEN_WIDTH}|${SCREEN_HEIGHT}`;
    const isMatchedEnvironment = prohibited_combination.has(matching_key);

    // 「特定の環境」かつ「許可されていない国」であれば true（禁止）を返す
    return isMatchedEnvironment && !isApprovedCountry();
}


function isProhibitedTimezone(){
    const prohibited_countries = ["Angola", "China", "Hong Kong", "Singapore"];

    return USER_COUNTRY === null || prohibited_countries.includes(USER_COUNTRY);
}


function isInappropriateResolution(){
    //検閲対象解像度
    const target_resolution = new Set([
        "0,0",
        "375,812","812,375",
        "517,826","826,517",
        //"600,800","800,600",
        "600,1080","1080,600",
        //"720,1280","1280,720",
        //"800,1280","1280,800",
        "1200,1280",
        "1200,3000",
        "1280,1200",
        "1366,1366",
        "1600,1600"
    ]);

    const my_pair = [SCREEN_WIDTH, SCREEN_HEIGHT];

    //検閲対象の解像度ならば、trueを返す。
    const is_matched_resolution = target_resolution.has(my_pair.join(','));

    //検閲対象解像度、かつ「許可されていない国」であれば true（禁止）を返す
    return is_matched_resolution && !isApprovedCountry();
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
    return reg_bot.test(UA);
}


function is360(){
    // 360 secure browser検出の正規表現
    const my_reg = /360se|WOW64|QIHU/i;
    return !!(UA && my_reg.test(UA));
}