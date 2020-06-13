//const login = require("facebook-chat-api");
const login = require("fca-unofficial");
const readline = require("readline");
const fileSystem = require("./../utils/file");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class ChatBot {
    constructor(CONFIG) {
        this.blockGroupIds = CONFIG.blockGroupIds || [];
        this.blockUserIds = CONFIG.blockUserIds || [];
        this.allowUserIds = CONFIG.allowUserIds || [];
        this.allowGroupIds = CONFIG.allowGroupIds || [];
        this.answeredThreads = {};
        this.botStatusThreads = {};
        this.PATH = CONFIG.path;
        this.credentials = {
            email: process.env.EMAIL || CONFIG.email,
            password: process.env.PASSWORD || CONFIG.password,
        };
    }

    async init(eventEmitter) {
        this.eventEmitter = eventEmitter;
        let appState = null;
        let credentials = this.credentials;
        let appStateExist = await fileSystem.isFileExist(this.PATH.facebook);
        if (appStateExist) appState = await fileSystem.readFile(this.PATH.facebook);
        if (appState)
            credentials = {
                appState: appState,
            };
        login(credentials, (err, api) => {
            if (err) {
                switch (err.error) {
                    case "login-approval":
                        console.log("Enter code > ");
                        rl.on("line", (line) => {
                            err.continue(line);
                            rl.close();
                        });
                        break;
                    default:
                        console.error(err);
                }
                return;
            }
            this.api = api;
            // write to file if app state not exist
            if (!appState) fileSystem.writeFile(this.PATH.facebook, api.getAppState());
            // return config bot
            return this.configBot();
        });
    }
    blockGroupChat(threadID) {
        if (this.blockGroupIds.find((x) => x == threadID)) {
            console.error("block GroupId: " + threadID);
            return true;
        }
        return false;
    }

    blockUserChat(threadID) {
        if (this.blockUserIds.find((x) => x == threadID)) {
            console.error("block ID: " + threadID);
            return true;
        }
        return false;
    }
    allowGroupChat(threadID) {
        if (this.allowGroupIds.find((x) => x == threadID)) {
            console.error("allow GroupId: " + threadID);
            return true;
        }
        return false;
    }

    allowUserChat(threadID) {
        if (this.allowUserIds.find((x) => x == threadID)) {
            console.error("allow ID: " + threadID);
            return true;
        }
        return false;
    }
    configBot() {
        this.api.setOptions({
            selfListen: true,
            logLevel: "silent",
            updatePresence: false,
            userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36", //get cái này xem trong file login.js
        });
        this.api.listenMqtt((err, message) => {
            if (!message) return;
            if (!message.body) return;
            if (!this.botStatusThreads[message.threadID]) {
                if (this.allowGroupChat[message.threadID] || this.allowUserChat[message.threadID]) {
                    this.botStatusThreads[message.threadID] = true;
                    return;
                } else {
                    return;
                }
            }

            //block icon: fix bug khi nhận đc icon
            if (message.body == "") {
                this.api.sendMessage("Bot không hiểu bạn nói. Xin lỗi nha :(", message.threadID);
                return;
            }

            if (message.body == "/startbot" || message.body == "/startBot") {
                this.botStatusThreads[message.threadID] = true;
                this.api.sendMessage(
                    "Đã bật bot strava. Gõ /help để xem các lệnh khả dụng",
                    message.threadID
                );
            } else if (message.body == "/offbot" || message.body == "/Offbot") {
                this.botStatusThreads[message.threadID] = false;
                this.api.sendMessage("Đã tắt chế độ nói chuyện với bot strava.", message.threadID);
            }
            if (this.botStatusThreads.hasOwnProperty(message.threadID)) {
                console.log(message.body);
                if (message.body.charAt(0) != "/") return;
                let messageArr = message.body.split(" ", 3);
                switch (messageArr[0]) {
                    case "/help": {
                        this.api.sendMessage(
                            "Trợ giúp: /help xem các lệnh chat bot\n \
                            /offbot tắt bot\n \
                            /getlastactivity xem hoạt động gần nhất.\n \
                            /getsummary <username> xem tổng kết tháng này của <username>",
                            message.threadID
                        );
                        break;
                    }
                    case "/getlastactivity":
                        this.eventEmitter.emit("getlastactivity", message.threadID);
                        break;
                    case "/getsummary":
                        this.eventEmitter.emit("getsummary", message.threadID, messageArr[1]);
                        break;
                }
                // api.sendMessage("Tin nhắn của tao đây", message.threadID);
            }

            /// first time running in threadId
            // if (!this.answeredThreads.hasOwnProperty(message.threadID)) {
            //     if (this.allowGroupChat(message.threadID)) {
            //         this.botStatusThreads[message.threadID] = true;
            //         return;
            //     }
            //     if (this.allowUserChat(message.threadID)) {
            //         this.botStatusThreads[message.threadID] = true;
            //         return;
            //     }
            //     this.answeredThreads[message.threadID] = true;
            //     this.api.sendMessage(
            //         "Tin nhắn trả lời tự động từ bot của Tâm.\n- Trả lời `/startbot` để làm việc với bot.",
            //         message.threadID
            //     );
            // }
        });
    }
    /**
     *
     * @param {string} content content of message want to send
     * @param {number} threadId id of user
     */
    sendMessage(content, threadId) {
        this.api.sendMessage(content, threadId);
    }
}
module.exports = ChatBot;
