async function logToDiscord() {
    const webhookUrl = 'https://discord.com/api/webhooks/1459720856203825315/jcn_enLc0xQKrTtKvSJev_T3m_cAnlBVlEgqZxESPBBp1V0pcPL5LGypcSJ8uZ47Q7d2';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const languages = navigator.languages;
    const resolution = `${SCREEN_WIDTH}x${SCREEN_HEIGHT}`;
    const previous_url = `${USER_REFERRER}`;
    const current_url = `${window.location.href}`;

    // Discordに送信するデータ構造
    let log_title = "🫥 Default";
    let log_color = 16777215; //白色

    switch (FLAG_MAP.log_mode) {
        case "record":
            log_title = "👻 NoReferrer Access";
            log_color = 10181046; // 紫色
            break;
        case "redirect":
            log_title = "🚀 Redirect Log";
            log_color = 15158332; // 赤色
            break;
    }

    const payload = {
        embeds: [{
            title: log_title,
            color: log_color,
            fields: [
                { name: "OS", value: USER_OS, inline: true },
                { name: "Browser", value: USER_BROWSER, inline: true },
                { name: "Resolution", value: resolution, inline: true },
                { name: "Timezone", value: timezone, inline: true },
                { name: "Languages", value: languages.toString(), inline: true },
                { name: "Previous URL", value: previous_url, inline: true },
                { name: "Current URL", value: current_url, inline: true },
                { name: "Comment", value: FLAG_MAP.reason, inline: false },
                { name: "UserAgent", value: `\`\`\`${UA}\`\`\``, inline: false }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        //await fetch(webhookUrl, {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            //keepalive: true,
            //mode: 'no-cors'
        });

        if (response) console.log('Fetch completion confirmed');

    } catch (error) {
        console.error('Failed to post to Discord:', error);
        FLAG_MAP.REASON = "fetch";
        executeRedirect();
    }
}