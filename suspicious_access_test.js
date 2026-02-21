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


function includesJapanese(){
    const APPROVED_LANGUAGES = ['ja'];
    const USER_LANGUAGES = navigator.languages || [navigator.language];
    
    // ユーザーの言語リストを、比較しやすいように最初の2文字（言語グループ）に正規化
    const hasApprovedLanguage = USER_LANGUAGES.some(userLang => {
        // ハイフンで分割して最初の要素だけを取り出す（例: 'en-US' -> 'en'）
        const langGroup = userLang.split('-')[0];
        return APPROVED_LANGUAGES.includes(langGroup);
    });

    return hasApprovedLanguage
}


function isProhibitedEnvironment() {
    // OS、ブラウザ、スクリーン解像度の組合せを保持しておく
    // 検閲対象リスト
    // フォーマット: "OS|Browser|Width|Height"
    const prohibited_combination = new Set([
        "|Chrome|412|915",
        "|Chrome|480|800",
        "|Chrome|1600|1000",
        "Android|Chrome|360|780",
        "Android|Chrome|375|812",
        "Android|Chrome|393|873",
        "Android|Chrome|397|720", "Android|Chrome|720|397",
        "Android|Chrome|400|726", "Android|Chrome|726|400",
        "Android|Chrome|1080|1920",
        "Android|Chrome|1920|1080",
        "Android|Firefox|432|964",
        "Android|Firefox|964|432",
        "Chrome OS|Chrome|1200|3000",
        "Linux|Chrome|1200|3000",
        "Linux|Chrome|1280|720",
        "Linux|Chrome|1280|800",
        "Linux|Chrome|1200|1920", //"Linux|Chrome|1920|1200",
        "Linux|Firefox|1024|1280", "Linux|Firefox|1280|1024",
        "Linux|Firefox|1200|1920", //"Linux|Firefox|1920|1200",
        "Linux|Firefox|1671|1114",
        "Mac OS|Chrome|800|600",
        "Mac OS|Chrome|1280|720",
        "Mac OS|Chrome|1232|1524",
        "Mac OS|Chrome|1366|1366",
        "Mac OS|Chrome|1920|1080",
        "OS X|Chrome|800|600",
        "OS X|Chrome|1232|1524",
        "OS X|Chrome|1366|1366",
        "OS X|Chrome|1920|1080",
        "iOS||375|812",
        "iOS|Chrome|800|600",
        "iOS|Safari|375|667",
        "iOS|Safari|375|812",
        "iOS|Safari|390|844",
        "Windows|Chrome|600|800","Windows|Chrome|800|600",
        "Windows|Chrome|993|1905",
        "Windows|Chrome|1905|993",
        "Windows|Chrome|1200|3000",
        "Windows|Chrome|1200|1280","Windows|Chrome|1280|1200",
        "Windows|Chrome|1366|768",
        "Windows|Chrome|1366|1366",
        "Windows|Chrome|3840|2160",
        "Windows|Edge|1200|3000",
        "Windows|Firefox|1600|900",
        "Windows|Opera|1920|1080",
        "Windows|Opera|1200|3000",
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

    // 検閲対象環境と一致しないなら即終了
    if (!isMatchedEnvironment) return false;

    // 検閲対象であり、日本国外からのアクセス→禁止
    // 建設対象であり、日本国内からのアクセスだが、日本語設定がない→禁止
    // 検閲対象であり、日本国内からのアクセスで、日本語設定あり→許可
    // 全てを総合すると「日本国内、かつ、日本語を含む」であれば許可（false）、それ以外は禁止（true）
    const isProhibited = !(isApprovedCountry() && includesJapanese());
    return isProhibited;

    // 「特定の環境」かつ「許可されていない国」であれば true（禁止）を返す
    // return isMatchedEnvironment && !isApprovedCountry();
}


function isProhibitedTimezone(){
    const prohibited_countries = ["Angola", "China", "Hong Kong", "Singapore"];

    return USER_COUNTRY === null || prohibited_countries.includes(USER_COUNTRY);
}


function isInappropriateResolution(){
    //検閲対象解像度
    const target_resolution = new Set([
        "0,0",
        "360,780","780,360",
        "375,667","667,375",
        "375,812","812,375",
        "480,800","800,480",
        "517,826","826,517",
        //"600,800","800,600",
        "600,1080","1080,600",
        //"720,1280","1280,720",
        //"800,1280","1280,800",
        "810,1080","1080,810",
        "1024,1280","1280,1024",
        "1200,1280","1280,1200",
        "1200,1920",//"1920,1200",
        "1200,3000",
        "1232,1524","1524,1232",
        "1262,1440","1440,1262",
        "1366,1366",
        "1600,1000",
        "1600,1600"
    ]);

    const my_pair = [SCREEN_WIDTH, SCREEN_HEIGHT];

    //検閲対象の解像度ならば、trueを返す。
    const is_matched_resolution = target_resolution.has(my_pair.join(','));

    // 検閲対象環境と一致しないなら即終了
    if (!is_matched_resolution) return false;

    // 検閲対象であり、日本国外からのアクセス→禁止
    // 建設対象であり、日本国内からのアクセスだが、日本語設定がない→禁止
    // 検閲対象であり、日本国内からのアクセスで、日本語設定あり→許可
    // 全てを総合すると「日本国内、かつ、日本語を含む」であれば許可（false）、それ以外は禁止（true）
    const isProhibited = !(isApprovedCountry() && includesJapanese());
    return isProhibited;

    //検閲対象解像度、かつ「許可されていない国」であれば true（禁止）を返す
    //return is_matched_resolution && !isApprovedCountry();
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