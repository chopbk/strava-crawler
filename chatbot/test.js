const fs = require("fs");
const login = require("facebook-chat-api");
var request = require("request");

var answeredThreads = {};
var botStatusThreads = {};
var isSimsimi = false;

blockGroupChat = function (threadID) {
    if (blockGroupIds.find((x) => x == threadID)) {
        console.error("block GroupId: " + threadID);
        return true;
    }
    return false;
};

blockUserChat = function (threadID) {
    if (blockUserIds.find((x) => x == threadID)) {
        console.error("block ID: " + threadID);
        return true;
    }
    return false;
};
let callback = (err, api) => {
    console.log(this);
    // api.setOptions({
    //     selfListen: true,
    //     logLevel: "silent",
    //     updatePresence: false,
    //     userAgent:
    //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36", //get cái này xem trong file login.js
    // });

    // if (err) return console.error(err);
    // var yourId = api.getCurrentUserID(); //lấy Id người login hiện tại

    // api.listenMqtt(function callback(err, message) {
    //     //block icon: fix bug khi nhận đc icon
    //     if (message.body == "") {
    //         api.sendMessage(
    //             "Bot không hiểu bạn nói. Xin lỗi nha :(",
    //             message.threadID
    //         );
    //         return;
    //     }

    //     //block all group : Chỗ này block all nhóm chát, k thíc thì comment lại
    //     //if (message.isGroup) return console.log("block all group");
    //     //Simsimi
    //     if (
    //         message.threadID !== "100002955257901" ||
    //         message.threadID !== "2434969166525250"
    //     )
    //         return;

    //     if (message.body == "/startbot" || message.body == "/startBot") {
    //         botStatusThreads[message.threadID] = true;
    //         api.sendMessage(
    //             "Đã bật bot strava. Gõ /help để xem các lệnh khả dụng",
    //             message.threadID
    //         );
    //     } else if (message.body == "/offbot" || message.body == "/Offbot") {
    //         botStatusThreads[message.threadID] = false;
    //         api.sendMessage(
    //             "Đã tắt chế độ nói chuyện với bot strava.",
    //             message.threadID
    //         );
    //     }
    //     if (botStatusThreads.hasOwnProperty(message.threadID)) {
    //         switch (message.body) {
    //             case "/help": {
    //                 api.sendMessage(
    //                     "/help xem các lệnh chat bot\
    //                 /offbot tắt bot\
    //                 /getStravaGeneral.",
    //                     message.threadID
    //                 );
    //                 break;
    //             }
    //         }
    //         // api.sendMessage("Tin nhắn của tao đây", message.threadID);
    //         return console.log("Pet next");
    //     }
    //     if (!answeredThreads.hasOwnProperty(message.threadID)) {
    //         //Chức năng này dành cho người muốn bỏ qua ID nào đó
    //         // Tìm id ở đây https://findmyfbid.in/
    //         // Thêm 1 người vào chỉ cần thêm dấu ,"ID người"
    //         // Group cũng thế

    //         //if(blockGroupChat(message.threadID)){
    //         //	return;
    //         //};
    //         if (blockUserChat(message.threadID)) {
    //             return;
    //         }

    //         answeredThreads[message.threadID] = true;
    //         api.sendMessage(
    //             "Tin nhắn trả lời tự động.\n- Trả lời `bot` để nói chuyện đỡ buồn.",
    //             message.threadID
    //         );
    //     }
    // });
};
class ChatBot {
    constructor() {
        this.api = null;
    }
    init() {
        console.log(this);
        //callback.bind(this);

        login(
            {
                appState: JSON.parse(
                    fs.readFileSync("./data/facebook.json", "utf8")
                ),
            },
            (err, api) => {
                this.api = api;
            }
        );
    }
}

let bot = new ChatBot();
bot.init();
