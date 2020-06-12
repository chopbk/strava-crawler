module.exports = {
    production: {
        options: {
            headless: true,
            //userDataDir: "./crawler/puppeteer_data",
            args: ['--proxy-server="direct://"', "--proxy-bypass-list=*"],
        },
        timeout: 45000,
    },
    dev: {
        options: {
            headless: true,
            //userDataDir: "./crawler/puppeteer_data",
            args: ['--proxy-server="direct://"', "--proxy-bypass-list=*"],
        },
        timeout: 45000,
    },
    test: {
        options: {
            headless: true,
            //userDataDir: "./crawler/puppeteer_data",
            args: ['--proxy-server="direct://"', "--proxy-bypass-list=*"],
        },
        timeout: 45000,
    },
    local: {
        options: {
            headless: true,
            //userDataDir: "./crawler/puppeteer_data",
            args: ['--proxy-server="direct://"', "--proxy-bypass-list=*"],
        },
        timeout: 45000,
    },
};
