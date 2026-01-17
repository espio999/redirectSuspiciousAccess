async function logToDiscord(mode, comment) {
    // DiscordのWebhook URL（ここに取得したURLをペーストしてください）
    const webhookUrl = 'https://discord.com/api/webhooks/1459720856203825315/jcn_enLc0xQKrTtKvSJev_T3m_cAnlBVlEgqZxESPBBp1V0pcPL5LGypcSJ8uZ47Q7d2';

    // ユーザー情報の取得
    const ua = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const resolution = `${SCREEN_WIDTH}x${SCREEN_HEIGHT}`;
    const previous_url = `${USER_REFERRER}`;
    const current_url = `${window.location.href}`;

    // 簡単なOS・ブラウザ判別ロジック
    let os = "Unknown OS";
    if (ua.indexOf("Win") != -1) os = "Windows";
    if (ua.indexOf("Mac") != -1) os = "Mac OS";
    if (ua.indexOf("Linux") != -1) os = "Linux";
    if (ua.indexOf("Android") != -1) os = "Android";
    if (ua.indexOf("like Mac") != -1) os = "iOS";

    let browser = "Unknown Browser";
    if (ua.indexOf("Chrome") != -1) browser = "Chrome";
    else if (ua.indexOf("Firefox") != -1) browser = "Firefox";
    else if (ua.indexOf("Safari") != -1) browser = "Safari";
    else if (ua.indexOf("Edge") != -1) browser = "Edge";

    // Discordに送信するデータ構造
    let log_title = "🫥 デフォルト";
    let log_color = 16777215; //白色

    switch (mode) {
      case "record":
        log_title = "👻 NoReferrerアクセス";
        log_color = 10181046; // 紫色
        break;
      case "redirect":
        log_title = "🚀 リダイレクト検知ログ";
        log_color = 15158332; // 赤色
        break;
    }

    const payload = {
        embeds: [{
            title: log_title,
            color: log_color, // 赤色
            fields: [
                { name: "OS", value: os, inline: true },
                { name: "ブラウザ", value: browser, inline: true },
                { name: "タイムゾーン", value: timezone, inline: true },
                { name: "解像度", value: resolution, inline: true },
                { name: "直前のURL", value: previous_url, inline: true },
                { name: "参照中のURL", value: current_url, inline: true },
                { name: "コメント", value: comment || "なし", inline: false },
                { name: "UserAgent詳細", value: `\`\`\`${ua}\`\`\``, inline: false }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        });
    } catch (error) {
        console.error('Discordへの送信に失敗しました:', error);
    }
}

